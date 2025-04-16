import Search from '@/public/icons/search'
import React from 'react'
import EmployeeCard from './employeeCard'

const EmployeeAttendance = () => {
    const employee = [
        {
          name: "Bagus",
          role: "CEO",
          empId: "EMP123",
          department: "Managerial",
          type: "Fulltime",
          email: "bagus@mail.com",
          joined: "29 Oct, 2020",
          image: "/images/avatar.jpg"
        },
        {
          name: "Ayesha",
          role: "Product Manager",
          empId: "EMP456",
          department: "Operations",
          type: "Fulltime",
          email: "ayesha@mail.com",
          joined: "10 Jan, 2021",
          image: "/images/avatar2.jpg"
        },
        {
          name: "Rahul",
          role: "Frontend Developer",
          empId: "EMP789",
          department: "Engineering",
          type: "Fulltime",
          email: "rahul@mail.com",
          joined: "15 Mar, 2022",
          image: "/images/avatar3.jpg"
        },
        {
          name: "Sophia",
          role: "UX Designer",
          empId: "EMP101",
          department: "Design",
          type: "Fulltime",
          email: "sophia@mail.com",
          joined: "04 Feb, 2023",
          image: "/images/avatar4.jpg"
        },
        {
          name: "Liam",
          role: "Backend Developer",
          empId: "EMP102",
          department: "Engineering",
          type: "Part-time",
          email: "liam@mail.com",
          joined: "12 Aug, 2022",
          image: "/images/avatar5.jpg"
        },
        {
          name: "Emma",
          role: "HR Manager",
          empId: "EMP103",
          department: "HR",
          type: "Fulltime",
          email: "emma@mail.com",
          joined: "20 Nov, 2019",
          image: "/images/avatar6.jpg"
        },
        {
          name: "Noah",
          role: "QA Engineer",
          empId: "EMP104",
          department: "Quality Assurance",
          type: "Contract",
          email: "noah@mail.com",
          joined: "11 Jul, 2021",
          image: "/images/avatar7.jpg"
        },
        {
          name: "Olivia",
          role: "Marketing Lead",
          empId: "EMP105",
          department: "Marketing",
          type: "Fulltime",
          email: "olivia@mail.com",
          joined: "05 Jan, 2020",
          image: "/images/avatar8.jpg"
        },
        {
          name: "James",
          role: "Data Analyst",
          empId: "EMP106",
          department: "Analytics",
          type: "Intern",
          email: "james@mail.com",
          joined: "01 Jun, 2023",
          image: "/images/avatar9.jpg"
        },
        {
          name: "Mia",
          role: "Customer Success Manager",
          empId: "EMP107",
          department: "Customer Success",
          type: "Fulltime",
          email: "mia@mail.com",
          joined: "19 Sep, 2020",
          image: "/images/avatar10.jpg"
        }
      ];
      
  return (
    <div className='contain px-2'>
      <div className="top flex justify-between items-end">
        <div className="text flex flex-col gap-2 px-2">
          <div className='font-semibold text-2xl'>All Employees</div>
          <div className='font-medium supporting-text'>All Employees in your organization</div>
        </div>
        <div className='BtnContainer flex gap-2 h-fit '>
          <div className="search flex items-center justify-start border-main rounded-lg  w-[300px] ">
            <div className='px-2'><Search /></div>
            <input type="text" placeholder='Search All Employees Here...' className='w-full h-full items-center focus:outline-none' />
          </div>
          <div className="btn btnPrimary text-white font-medium px-4 py-2 rounded-md cursor-pointer">Add new Employee</div>
        </div>
      </div>

      <div className='p-2 w-full h-full mt-4 flex gap-4 flex-wrap'>
        {
          employee.map((data, index) => (
            <EmployeeCard
              key={index}
              name={data.name}
              role={data.role}
              empId={data.empId}
              department={data.department}
              type={data.type}
              email={data.email}
              joined={data.joined}
              image={data.image}
            />
          ))
        }
      </div>
    </div>
  )
}

export default EmployeeAttendance
