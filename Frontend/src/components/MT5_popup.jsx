import React, { useState } from 'react'
import "./MT5_popup.css"
import axios from 'axios'

const MT5_popup = () => {

    const [gentoken, setGentoken] = useState(null)
    const [form, setForm] = useState({
        mt5id: '',
        mt5name: '',
        token: ''
    })

    var rand = function () {
        return Math.random().toString(36).substr(2);
    };

    const copytext = function () {
        var Text = document.getElementById("apitoken");
        navigator.clipboard.writeText(Text.value);
    }

    const createtoken = async () => {
        setGentoken(rand() + rand() + rand())
    };

    const handleChange = (e) => {
        console.log(e.target.name, e.target.value)
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const acc = await axios.post('http://localhost:8000/MT5/create', {
                mt5id: form.mt5id,
                mt5name: form.mt5name,
                token: gentoken
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            console.log("create mt5 success", acc)
        } catch (error) {
            console.log("create mt5 error")
        }
    }

    return (
        <div>

            <input type="text" onChange={e => handleChange(e)} placeholder='mt5_id' name='mt5id' className="mt5id" />
            <br /><br />
            <input type="text" onChange={e => handleChange(e)} placeholder='name' name='mt5name' className="name" />
            <br /><br />
            {gentoken === null ? (
                <div>
                    <br /><br />
                    <button onClick={createtoken}>generate token</button>
                </div>) :
                <div>
                    <input type="text" value={gentoken} className="token" name='token' id='apitoken' disabled />
                    <br /><br />
                    <button onClick={copytext}>Copy text</button>
                    <button onClick={handleSubmit}>create</button>
                </div>}


        </div>
    )
}

export default MT5_popup