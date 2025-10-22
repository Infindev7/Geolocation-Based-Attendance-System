import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Admin.css'
import { TbLocationCheck } from "react-icons/tb";


function Admin() {
  const [presentData, setPresentData] = useState([])
  const [admin, setAdmin] = useState(false)
  const [data, setData] = useState([])
  const nav = useNavigate()

  // format distance to 2 decimal places, handle null/invalid values
  const formatDistance = (d) => {
    if (d === null || d === undefined) return 'N/A'
    const n = Number(d)
    return Number.isFinite(n) ? n.toFixed(2) : 'N/A'
  }

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin") ? JSON.parse(localStorage.getItem("admin")) : null
    if(isAdmin != null && isAdmin.admin){
      setAdmin(true)
      const fetchData = async () => {
        try {
          const res = await axios.get("http://localhost:8080/admin/getPresentStudents")
          setPresentData(Array.isArray(res.data) ? res.data : [])
        } catch (err) {
          console.error(err)
        }

        try{
          const res = await axios.get("http://localhost:8080/admin/getAllStudents")
          setData(Array.isArray(res.data) ? res.data : [])
        }catch(err) {
          console.error(err)
        }
      }

      fetchData()

      const intervalid = setInterval(fetchData, 5000)

      return () => clearInterval(intervalid)

    }
  }, []) // run once and poll

  function handleAddStudent() {
    nav("/AddStudent")
  }

  return (
    <div className="admin-page">
      <div className="login-header"> <TbLocationCheck /> EduTrack</div>

      {admin ? (
      <>
      <div className="admin-controls">
        <button className="add-button" onClick={handleAddStudent}>+ Add Student</button>
      </div>

      <div className="panels">
        <section className="panel present-panel">
          <h2>Present Students</h2>
          {presentData.length === 0 ? (
            <p className="empty">No students found.</p>
          ) : (
            <table className="styled-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Dist.</th>
                </tr>
              </thead>
              <tbody>
                {presentData.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{formatDistance(student.distance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="panel list-panel">
          <h2>Student List</h2>
          {data.length === 0 ? (
            <p className="empty">No students found.</p>
          ) : (
            <table className="styled-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Dist. in meters</th>
                </tr>
              </thead>
              <tbody>
                {data.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{formatDistance(student.distance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
      </>
      ) : (
        <div className='access-denied'>
          <strong>ACCESS DENIED</strong>
        </div>
      )}
    </div>
  )
}

export default Admin
