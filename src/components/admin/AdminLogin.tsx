import { useFormik } from "formik"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { adminValidation } from "../../utils/validation"

function AdminLogin() {
    const navigate=useNavigate()
    const dispatch=useDispatch()

    const initialValues={
        email:"",
        password:""
    }

    const formik =useFormik({
        initialValues,
        validationSchema:adminValidation,
        onSubmit:async(values)=>{
            const {data}=await 
        }
    })

  return (
    <div>
      
    </div>
  )
}

export default AdminLogin
