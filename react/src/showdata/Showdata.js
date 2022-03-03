import React, {Component} from "react";
import axios from "axios";
import Modal from 'react-awesome-modal';
import './Showdata.css';
//import '../../server/app';
import {ip,port} from "../setIP/setting";

export default class Showdata extends Component{
    constructor() {
        super();
        this.state ={
            list:[],
            list_province: [],
            list_district: [],
            list_subdistrict: [],
            list_village: [],
            id: 0,
            firstname: "",
            lastname: "",
            Regisby: "",
            phonenum: "",
            date_on: "",
            province: "",
            district: "",
            subdistrict: "",
            village: "",
        }
        this.handleChang = this.handleChang.bind(this);
        this.handleClicked = this.handleClicked.bind(this);
        //console.log("hello show data");
    }

    _baseURL = '';

    componentDidMount() {
        setTimeout( () => {
            this.getData();
        }, 1);
    }
    getData = () => {
        console.log("before fetch data");
        fetch('/data')
            .then(res => res.json())
            .then(list => {
                console.log(list)
                this.setState({ list });

            })
        console.log("after fetch data");
    }

    onDelete=(user)=>{
        const result = window.confirm(`You can Delete ${user.firstname} ${user.lastname} ?`);
        if (result) {
            let url = `${this._baseURL}/delete`;
            let data = {
                id: user.id
            };
            axios.put(url,data);
            this.componentDidMount();
        }
    }

    getProvinces() {
        axios.get('/provinces')
        .then(res => {
            this.setState(() => ({list_province: res.data}));
        });
    }

    getDistricts(value) {
        axios.get(`/districts?provinceId=${value}`)
        .then(res => {
            this.setState(() => ({list_district: res.data}));
        });
    }

    getSubDistricts(value) {
        axios.get(`/subdistricts?districtId=${value}`)
        .then(res => {
            this.setState(() => ({list_subdistrict: res.data}));
        });
    }

    getVillage(value) {
        axios.get(`/villages?subdistrictId=${value}`)
        .then(res => {
            this.setState(() => ({list_village: res.data}));
        });
    }

    openModal(user) {
        this.getProvinces();
        this.getDistricts(user.provinceId);
        this.getSubDistricts(user.districtId);
        this.getVillage(user.subdistrictId);

        this.setState({
            visible : true
        });
    }
    closeModal() {
        this.setState({
            visible : false
        });
    }
    call=(user)=>{
        this.openModal(user);
        this.setState({
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            phonenum: user.phonenum,
            regisTime: user.regisTime,
            Regisby: user.Regisby,
            province: user.province,
            district: user.district,
            subdistrict: user.subdistrict,
            village: user.village,
        })
    }
    handleChang = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });

        switch(e.target.id) {
            case 'province':
                this.getDistricts(e.target.value);
                this.state.list_subdistrict = [];
                this.state.list_village = [];
                document.getElementById('district').disabled = e.target.value === "0" ? true : false;
                document.getElementById('subdistrict').disabled = true;
                document.getElementById('village').disabled = true;
                break;
            case 'district':
                this.getSubDistricts(e.target.value);
                this.state.list_village = [];
                document.getElementById('subdistrict').disabled = e.target.value === "0" ? true : false;
                document.getElementById('village').disabled = true;
                break;
            case 'subdistrict':
                this.getVillage(e.target.value);
                document.getElementById('village').disabled = e.target.value === "0" ? true : false;
                break;
        }
        // let url = `https://localhost:3000/data`;
        // let data = {
        //     user_id: this.state.user_id,
        //     user_firstname: this.state.user_firstname,
        //     user_lastname: this.state.user_lastname,
        //     user_email: this.state.user_email,
        //     user_phone: this.state.user_phone
        // }
        // axios.put(url,data)
    }

    getDateTimeFormatted = (data) => {
        const date = new Date(data);
        const resultDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const resultTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return `${resultDate} ${resultTime}`;
    }

    handleClicked(){
        let url = `${this._baseURL}/data`;
        let data = {
            id: this.state.id,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            phonenum: this.state.phonenum,
            province: this.state.province,
            district: this.state.district,
            subdistrict: this.state.subdistrict,
            village: this.state.village,
        }
        axios.put(url,data)
        this.setState({
            id: 0,
            firstname: "",
            lastname: "",
            phonenum: "",
            regisTime: "",
            province: "",
            district: "",
            subdistrict: "",
            village: "",
        });
	this.closeModal();
        setTimeout(()=>{this.componentDidMount()},1)
    }
    render() {
        let {list} = this.state;

        return (
            <div className="App">
                <h2 className="my-4">Users Information <div>Total {this.state.list.length} Item</div></h2>
                <hr/>
                <div className="container p-3 my-3 bg-light text-black">
                    <table className="table table-light">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Detail</th>
                                <th>Create By</th>
                                <th>Update on</th>
                                <th>Manage Menu</th>
                            </tr>
                        </thead>
                        <tbody>
                                {list.map((user) =>{
                                    return(
                                        <tr>
                                            <td>{user.id}</td>
                                            <td>{user.firstname} {user.lastname}</td>
                                            <td>
                                                <ul className="text-left">
                                                    <li><b>Phone:</b> {user.phonenum}</li>
                                                    <li><b>Village:</b> {user.villageName}</li>
                                                    <li><b>Sub-District:</b> {user.subdistrictName}</li>
                                                    <li><b>District:</b> {user.districtName}</li>
                                                    <li><b>Province:</b> {user.provinceName}</li>
                                                </ul>
                                            </td>
                                            <td>{user.Regisby}</td>
                                            <td>{this.getDateTimeFormatted(user.regisTime)}</td>
                                            <td>
                                                <button type="button" class="btn btn-warning m-2" onClick={()=>this.call(user)}>Edit</button>
                                                <button type="button" class="btn btn-danger m-2"  onClick={()=>this.onDelete(user)}>Delete</button>
                                            </td>
                                            <div className="box">
                                                <Modal visible={this.state.visible}
                                                    width="1200"
                                                    height="600"
                                                    effect="fadeInUp"
                                                    onClickAway={() => this.closeModal()}
                                                >
                                                    <form className="container" id='form'>
                                                        <div className="form-group">
                                                            <h3><label htmlFor="id">ID: {this.state.id}<br/></label></h3>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>Firstname:</label>
                                                                    <input type="text" className="form-control" id="firstname" onChange={this.handleChang} value={this.state.firstname}/>
                                                                </div>
                                                            </div>
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>Lastname:</label>
                                                                    <input type="text" className="form-control" id="lastname" onChange={this.handleChang} value={this.state.lastname}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>Phone:</label>
                                                                    <input type="text" className="form-control" id="phonenum" onChange={this.handleChang} value={this.state.phonenum}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>Village</label>
                                                                    <select className="form-control" id="village" onChange={this.handleChang} >
                                                                        <option value={0}></option>
                                                                        {
                                                                            this.state.list_village.map((item) => {
                                                                                return(
                                                                                    <option value={item.villageId} selected={item.villageId == this.state.village}>{item.villageName}</option>
                                                                                );
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>Sub-District</label>
                                                                    <select className="form-control" id="subdistrict" onChange={this.handleChang} >
                                                                        <option value={0}></option>
                                                                        {
                                                                            this.state.list_subdistrict.map((item) => {
                                                                                return(
                                                                                    <option value={item.subdistrictId} selected={item.subdistrictId == this.state.subdistrict}>{item.subdistrictName}</option>
                                                                                );
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>District</label>
                                                                    <select className="form-control" id="district" onChange={this.handleChang} >
                                                                        <option value={0}></option>
                                                                        {
                                                                            this.state.list_district.map((item) => {
                                                                                return(
                                                                                    <option value={item.districtId} selected={item.districtId == this.state.district}>{item.districtName}</option>
                                                                                );
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>Province</label>
                                                                    <select className="form-control" id="province" onChange={this.handleChang}>
                                                                        <option value={0}></option>
                                                                        {
                                                                            this.state.list_province.map((item) => {
                                                                                return(
                                                                                    <option value={item.provinceId} selected={item.provinceId == this.state.province}>{item.provinceName}</option>
                                                                                );
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="id">Create By: {this.state.Regisby}<br/></label>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="id">Update on: {this.getDateTimeFormatted(this.state.regisTime)}<br/></label>
                                                        </div>
                                                        <button type="button" className="btn btn-primary" onClick={this.handleClicked}>Save</button>
                                                    </form>
                                                </Modal>
                                            </div>
                                        </tr>
                                    )})}
                        </tbody>
                    </table>
                </div><br/>
            </div>
        );
    }
}