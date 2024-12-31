
import Offering from './Offering'
import './Offering.css'
import AboutMe from './AboutMe'
import Espresso from './Espresso'
import Links from './Links'
import './App.css'


function App() {
  return (
    <div className="container">
      <div className="half">
        <div className="inner-container">
          <Offering />
          <div className='links-bio'>
            <AboutMe />
            <Links />
          </div>
          
        </div>
      </div>

      <div className="half">
        <Espresso />

      </div>
    </div>
  );

  // return (
  //   <>
  //     <Offering/>
  //     <AboutMe/>
  //     <Espresso/>
  //   </>
    
  // )
}

export default App
