import './App.css';
import {useEffect, useState} from "react";
import Pagination from './component/Pagination';

function App() {
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [editBox, setEditBox] = useState(false);
  const [editContent, setEditContent] = useState({});
  const [checkbox, setCheckBox] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const fetchData=async()=>{
      let perPage=10;
      let start =(page-1)*perPage;
      let end = 10*page
      fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
      .then((res) => res.json())
      .then((res) => {
        let data=[];
        setTotalPage(Math.ceil(res.length/perPage));
        data = res.slice(start, end);
        setUserData(data);
      })
      .catch((err)=> console.log(err))
      
  }

  const deleteUser = async(id)=>{
    let data = userData.filter((user) => user.id!==id);
    setUserData(data);
  }

  const editUser=(id)=>{
    setEditBox(true);
    let data = userData.filter((user) => user.id===id)
    setEditContent(data[0]);
  }

  const updateUser=(id)=>{
    let update = userData.map((user) => user.id===id ? editContent : user)
    setUserData(update);
    setEditBox(false);
  }

  const checkboxElement = (id, check)=>{
    if(check){
      setCheckBox([...checkbox, id])
    }else{
      let index = checkbox.indexOf(id);
      checkbox.splice(index, 1)
    }
  }

  const deleteSelectedUser = () => {
    let data = userData;
    for(let i=0; i<checkbox.length; i++){
      data = data.filter((user) => user.id!==checkbox[i]);
    }
    setUserData(data);
  }

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearch(q);

    const filtered = userData.filter((user) => {
      return Object.values(user).some((value) => 
      value.toString().toLowerCase().includes(q.toLowerCase())
      );
    })
    setFilterData(filtered);
  }

  // console.log(filterData)

  useEffect(() => {
    fetchData();
  }, [page, checkbox]);

  return (
    <>
    <div className="App">
      <div className='searchInput'>
        <input type="text" placeholder="Search by name, email, or role" onChange={handleSearch} value={search}/>
      </div>
      <table>
        <thead>
          <tr>
            <th>Select All</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody >
          {filterData.length!==0 ? 

          filterData.map((user) => (
            <tr key={user.id} className={checkbox.includes(user.id) ? "highlight" : ""}>
              <td><input type={"checkbox"} onChange={(e)=>checkboxElement(user.id, e.target.checked)}/></td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <div className='functionalityButton'>
                  <button onClick={()=> editUser(user.id)}>Edit</button>
                  <button onClick={()=>deleteUser(user.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))

          :

          userData.map((user) => (
            <tr key={user.id} className={checkbox.includes(user.id) ? "highlight" : ""}>
              <td><input type={"checkbox"} onChange={(e)=>checkboxElement(user.id, e.target.checked)}/></td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <div className='functionalityButton'>
                  <button onClick={()=> editUser(user.id)}>Edit</button>
                  <button onClick={()=>deleteUser(user.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))
          }
        </tbody>
      </table>
      <div className='footer'>
        <button onClick={deleteSelectedUser}>Delete Selected</button>
        <Pagination totalPage={totalPage} page={page} setPage={setPage}/>
      </div>
    </div>
    {editBox && 
    <div className='modal'>
      <div className='popup'>
        <div className='closeButton' onClick={()=>setEditBox(false)}>&times;</div>
        <div>
          <div className='editDiv'>
            <label>Name: </label>
            <input type={"text"} onChange={(e) => setEditContent({...editContent, name: e.target.value})} value={editContent.name}/>
            </div>
          <div className='editDiv'>
            <label>Email:</label>
            <input type={"email"} onChange={(e) => setEditContent({...editContent, email: e.target.value})} value={editContent.email}/>
            </div>
          <div className='editDiv'>
            <label>Role:</label>
            <input type={"text"} onChange={(e) => setEditContent({...editContent, role: e.target.value})} value={editContent.role}/>
            </div>
        </div>
        <button className='saveChanges' onClick={()=>updateUser(editContent.id)}>Save Changes</button>
      </div>
    </div>
  }
    </>
  );
}

export default App;
