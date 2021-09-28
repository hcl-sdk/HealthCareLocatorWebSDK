import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom";
import cls from 'classnames';

export default function Devtools() {
  const settingsPanelRef = useRef(null)
  const [isOpenSettings, setIsOpenSettings] = useState(false)

  useEffect(() => {
    if (settingsPanelRef.current && settingsPanelRef.current.addEventListener) {
      settingsPanelRef.current.addEventListener('backPressed', function() {
        setIsOpenSettings(false)
      })
    }
  }, [])

  function openSettings(evt) {
    evt.preventDefault()
    setIsOpenSettings(true)
  }

  function toggleMobileMenu() {
    document.body.classList.toggle('menu-opened')
  }
  
  return (
    <section className={cls('sidebar', {
      'settings-opened': isOpenSettings
    })}>
      <header>
        <div className="burger" onClick={toggleMobileMenu}><div></div><div></div><div></div></div>
        <h1>SDK Sample React App</h1>
      </header>
      <ul className="menu">
        <li className="menu-item">
          <Link to="/" className="active">Home</Link>
        </li>
        <li className="menu-item">
          <Link to="/search">Search for HCPs</Link>
        </li>
        <li className="menu-item">
          <Link to="/search?sp=dentistry">Find a dentist near me</Link>
        </li>
        <li className="menu-item">
          <Link to="/search?sp=cardiology">Find a cardiologist near me</Link>
        </li>
        <li className="menu-item">
          <a href="/" onClick={openSettings}>Settings</a>
        </li>
      </ul>
      <div className="sidenav-settings">
        <settings-panel ref={settingsPanelRef}></settings-panel>
      </div>
    </section>
  )
}