import React, {useState, useEffect} from 'react'
import ReactMapGL, {Marker, Popup} from 'react-map-gl'
import {Room, Star} from '@material-ui/icons'
import Register from './components/Register'
import Login from './components/Login'
import './App.css'
import axios from 'axios'
import {format} from 'timeago.js'

function App() {

  const myStorage = window.localStorage;
  const [pins, setPins] = useState([])
  const [currentUser, setCurrentUser] = useState(myStorage.getItem('username'))
  const [currentPlaceId, setCurrentPlaceId] = useState(null)
  const [newPlace, setNewPlace] = useState(null)
  const [title, setTitle] = useState(null)
  const [desc, setDesc] = useState(null)
  const [rating, setRating] = useState(0)
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [viewport, setViewport] = useState({

    latitude: 47,
    longitude: 17,
    zoom: 4,
    width : "100vw",
    height : "100vh"

  });

  useEffect(() => {

      axios.get('/api/pin')
        .then((getPins) => setPins(getPins.data))
                           
        .catch((error) => console.log(error))

  }, [])

  const handleMarkerClick = (id, lat, lon) => {

        setCurrentPlaceId(id)

        setViewport({
          ...viewport,
          latitude: lat,
          longitude: lon
        })

  }

  const handleAddClick = (e) => {

      setNewPlace({
        
        lon : e.lngLat[0],
        lat : e.lngLat[1]

      })

  }

  const handleSubmit = (e) => {

        e.preventDefault()

        const newPin = {

            username : currentUser,
            title,
            desc,
            rating,
            lat : newPlace.lat,
            lon : newPlace.lon
        }

        try {

              axios.post('/api/pin', newPin)
                .then((response) => {

                    setPins([...pins, response.data])
                    setNewPlace(null)
                }).catch((error) => console.log(error))

        } catch(error) {

            console.log(error)

        }
  }

  const handleLogout = () => {

        myStorage.removeItem('username')
        setCurrentUser(null)
  }

  return (
          <ReactMapGL
            {...viewport}     
            onViewportChange={(viewport) => setViewport(viewport)}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
            mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
            onDblClick={handleAddClick}
            transitionDuration="200ms">
            
            { 
             pins.map((pin) => (
            
                <>
                 <Marker latitude={pin.lat} longitude={pin.lon} offsetLeft={-viewport.zoom * 3.5} offsetTop={-viewport.zoom * 7}>
                 <Room 
                    onClick={() => handleMarkerClick(pin._id, pin.lat, pin.lon)}
                    style={{
                      fontSize: 7 * viewport.zoom,
                      color: currentUser === pin.username ? "tomato" : "slateblue",
                      cursor: "pointer",
                    }}>

                 </Room>
                 </Marker>
                 { pin._id === currentPlaceId  && (
                 <Popup
                    latitude={pin.lat}
                    longitude={pin.lon}
                    closeButton={true}
                    closeOnClick={false}
                    onClose={() => setCurrentPlaceId(null)}
                    anchor="left" >
                    <div className="card">
                    <label>Place</label>
                    <h1 className="place">{pin.title}</h1>
                    <label>Review</label>
                    <p clasName="desc">{pin.desc}</p>
                    <label>Rating</label>

                    <div className="stars">         
                        {Array(pin.rating).fill(<Star className="star" />)}                               
                    </div>

                      <label>Information</label>
                      <span className="username">Created by <b>{pin.username}</b></span>
                      <span className="date">{format(pin.createdAt)}</span>

                    </div>
            </Popup>) }
  
                </>
             ))}

             { newPlace && currentUser &&(

               <Popup
                  latitude={newPlace.lat}
                  longitude={newPlace.lon}
                  closeButton={true}
                  closeOnClick={false}
                  onClose={() => setNewPlace(null)}
                  anchor="left">
                  <div>
                    <form onSubmit={handleSubmit}>
                      <label>Title</label>
                      <input placeholder="Enter a title" onChange={(e) => setTitle(e.target.value)}/>
                      <label>Review</label>
                      <textarea placeholder="Say us something about this place" onChange={(e) => setDesc(e.target.value)} />
                      <label>Rating</label>
                      <select onChange={(e) => setRating(e.target.value)}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                      <button className="submitButton" type="submit" >Add Pin</button>
                    </form>
                  </div>
               </Popup>
             )}
            
            {currentUser ? (<button className="button logout" onClick={handleLogout}>Logout</button>)
              
             :( <div className="buttons">
                <button className="button login" onClick={() => setShowLogin(true)}>Login</button>
                <button className="button register" onClick={() => setShowRegister(true)}>Register</button>
              </div>)
           
             }
             {showRegister && (<Register setShowRegister={setShowRegister}/> )}
             {showLogin && (<Login setShowLogin={setShowLogin} setCurrentUser={setCurrentUser} myStorage={myStorage}/> )}
            </ReactMapGL>
          
  )
}

export default App;
