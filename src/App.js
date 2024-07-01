import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here

const Header = () => (
  <div className="header-container">
    <img
      src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
      alt="website logo"
      className="website-logo"
    />
  </div>
)

const FailureView = props => {
  const {retryProjectsDetails} = props
  const onRetry = () => {
    retryProjectsDetails()
  }

  return (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-note">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="retry-button" type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

const ProjectItem = props => {
  const {itemDetails} = props
  const {name, imageUrl} = itemDetails

  return (
    <li className="project-item">
      <img src={imageUrl} alt={name} className="project-img" />
      <p className="name">{name}</p>
    </li>
  )
}

const ProjectList = props => {
  const {projectList} = props
  return (
    <ul className="project-list">
      {projectList.map(eachproject => (
        <ProjectItem itemDetails={eachproject} key={eachproject.id} />
      ))}
    </ul>
  )
}

const apiContantsOfProjects = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class App extends Component {
  state = {
    activeId: categoriesList[0].id,
    projectList: [],
    apiStatus: apiContantsOfProjects.initial,
  }

  componentDidMount() {
    this.getProjectsList()
  }

  getProjectsList = async () => {
    this.setState({apiStatus: apiContantsOfProjects.inProgress})
    const {activeId} = this.state

    const projectUrl = `https://apis.ccbp.in/ps/projects?category=${activeId}`
    const option = {
      method: 'GET',
    }
    const projectsResponse = await fetch(projectUrl, option)
    if (projectsResponse.ok) {
      const projectsData = await projectsResponse.json()
      const updatedData = projectsData.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        projectList: updatedData,
        apiStatus: apiContantsOfProjects.success,
      })
    } else {
      this.setState({apiStatus: apiContantsOfProjects.failure})
    }
  }

  onChangeOption = event => {
    this.setState({activeId: event.target.value}, this.getProjectsList)
  }

  renderProjectsLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" width={50} height={50} />
    </div>
  )

  renderProjectsSuccessView = () => {
    const {projectList} = this.state

    return <ProjectList projectList={projectList} />
  }

  retryProjectsDetails = () => {
    this.getProjectsList()
  }

  renderprojectsFailureView = () => (
    <FailureView retryProjectsDetails={this.retryProjectsDetails} />
  )

  renderProjectsDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiContantsOfProjects.inProgress:
        return this.renderProjectsLoadingView()
      case apiContantsOfProjects.success:
        return this.renderProjectsSuccessView()
      case apiContantsOfProjects.failure:
        return this.renderprojectsFailureView()
      default:
        return null
    }
  }

  render() {
    const {activeId} = this.state

    return (
      <div className="projects-showcase-container">
        <Header />
        <div className="project-selection-container">
          <select
            className="select"
            value={activeId}
            onChange={this.onChangeOption}
          >
            {categoriesList.map(eachCategory => (
              <option key={eachCategory.id} value={eachCategory.id}>
                {eachCategory.displayText}
              </option>
            ))}
          </select>
        </div>
        {this.renderProjectsDetails()}
      </div>
    )
  }
}

export default App
