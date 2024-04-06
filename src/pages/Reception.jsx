import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
export default function Reception() {
  const [dep, setDep] = useState(false)
  const [data, setData] = useState([])
  const [course, setCourse] = useState([])

  const [open, setOpen] = useState(false)
  const [id, setId] = useState(null)


  const name = useRef();
  const surname = useRef();
  const phone = useRef();
  const cours = useRef();



  useEffect(() => {
    axios.get("https://65af84f32f26c3f2139b0190.mockapi.io/reception")
      .then(res => setData(res.data))
      .catch(error => console.log(error))

    axios.get("https://65af84f32f26c3f2139b0190.mockapi.io/courses")
      .then(res => setCourse(res.data))
      .catch(error => console.log(error))

  }, [dep])



  const remove = (id) => {
    axios.delete(`https://65af84f32f26c3f2139b0190.mockapi.io/reception/${id}`)
      .then(() => setDep(!dep))
      .catch(error => console.log(error))
  }


  const sendData = (e) => {
    e.preventDefault()
    let newData = {
      "student_surname": surname.current.value,
      "student_phone": phone.current.value,
      "student_name": name.current.value,
      "course": JSON.parse(cours.current.value),
    }
    if (!id) {
      axios.post("https://65af84f32f26c3f2139b0190.mockapi.io/reception", newData, {
        headers: {
          "Content-Type": "application/json"
        }
      }).then(() => {
        setDep(!dep)
        setOpen(false)
        e.target.reset()
      })
        .catch((error) => console.log(error))
    }

    axios.put(`https://65af84f32f26c3f2139b0190.mockapi.io/reception/${id}`, newData, {
      headers: {
        "Content-Type": "application/json"
      }
    }).then(() => {
      setDep(!dep)
      setOpen(false)
      e.target.reset()
      setId(null)
    })
      .catch((error) => console.log(error))


  }

  const getId = (id) => {
    axios.get(`https://65af84f32f26c3f2139b0190.mockapi.io/reception/${id}`)
      .then(res => {
        let d = res.data;
        name.current.value = d.student_name;
        surname.current.value = d.student_surname;
        phone.current.value = d.student_phone;
        cours.current.value = JSON.stringify(d.course);
        setOpen(true);
        setId(d.id)
      }).catch(eror => console.log(eror))
  }

  return (
    <>
      <div className='News'>
        <h1 className='News-title'>Reception</h1>
        <button className='Add' onClick={() => setOpen(true)}>Add</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Phone</th>
            <th>Course</th>
            <th>-/-</th>
          </tr>
        </thead>
        <tbody>
          {
            data.length > 0 ?
              data.map(item => <tr key={item.id}>
                <td>{item.student_name}</td>
                <td>{item.student_surname}</td>
                <td>{item.student_phone}</td>
                <td>{item.course?.name}</td>
                <td>
                  <button className='delete' onClick={() => remove(item.id)}><i className="bi bi-trash3"></i></button>
                  <button className='edit' onClick={() => getId(item.id)}><i className="bi bi-pen"></i></button>
                </td>
              </tr>)
              :
              <tr><td colSpan={5}>No Data</td></tr>
          }
        </tbody>
      </table>




      {/* popup */}
      <div className={open ? "modal-container modal-active" : "modal-container"} onClick={() => setOpen(false)}>
        <div className='modal' onClick={(e) => e.stopPropagation()}>
          <h1 className='modal-title'>Create course</h1>
          <form className='form' onSubmit={sendData}>
            <input ref={name} required type="text" placeholder='Enter  name' />
            <input ref={surname} required type="text" placeholder='Enter  surname' />
            <input ref={phone} required type="text" placeholder='Enter  phone' />

            <select ref={cours}>
              {
                course.map(item => <option key={item.id} value={JSON.stringify(item)}>{item.name}</option>)
              }
            </select>

            <button type='submit' className='add-new-course'>{id ? "Update" : "Save"}</button>
          </form>
        </div>
      </div>
      {/* popup */}



    </>
  )
}
