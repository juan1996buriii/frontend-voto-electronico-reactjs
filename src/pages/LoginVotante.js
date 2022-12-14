import classNames from "classnames";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { VotanteService } from "../service/VotanteService";
import { Toast } from "primereact/toast";
import "../styles/LoginVotante.css";
import logo from "../images/logo.png";
import { ProcesoEleccionService } from "../service/ProcesoEleccionService";
import { VotoService } from "../service/VotoService";
import Swal from "sweetalert2";

const LoginVotante = () => {
    const history = useHistory();
    const [codigo, setCodigo] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);

    const onInputChange = (e) => {
        const { value } = e.target;
        setCodigo(value);
    };
    const saveUser = () => {
        setSubmitted(true);
        if (codigo.trim()) {
            const votanteService = new VotanteService();
            votanteService.getLogin(codigo).then((res) => {
                if (res === 500) {
                    toast.current.show({ severity: "error", summary: "Error Message", detail: "El codigo es incorrecto", life: 3000 });
                } else {
                    if (res.activo) {
                        const procesoEleccionService = new ProcesoEleccionService();
                        procesoEleccionService.getProcesoEleccionAVotar(res).then((_procesos) => {
                            if (_procesos[0]?.activo === true) {
                                const validarVoto = {
                                    idVotante: "",
                                    idProcesoEleccion: "",
                                };
                                validarVoto.idVotante = res.id;
                                validarVoto.idProcesoEleccion = _procesos[0].id;
                                const votoService = new VotoService();
                                votoService.postVerificarVoto(validarVoto).then((res) => {
                                    if (res.success) {
                                        history.push("/votante");
                                    } else {
                                        Swal.fire({
                                            position: "center",
                                            icon: "error",
                                            title: "YA HAS VOTADO EN ESTE PROCESO",
                                            confirmButtonText: "SALIR",
                                            showConfirmButton: true,
                                        }).then((res) => {
                                            if (res.isConfirmed) {
                                                window.localStorage.removeItem("institucion");
                                                setCodigo("");
                                            }
                                        });
                                    }
                                });
                            } else {
                                Swal.fire({
                                    position: "center",
                                    icon: "error",
                                    title: "NO SE ENCUENTRA ACTIVO NINGUN PROCESO",
                                    confirmButtonText: "SALIR",
                                    showConfirmButton: true,
                                });
                                setCodigo("");
                            }
                        });
                    } else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "TU CUENTA NO SE ENCUENTRA ACTIVA",
                            confirmButtonText: "SALIR",
                            showConfirmButton: true,
                        });
                        setCodigo("");
                    }
                }
            });
        }
    };
    return (
        <div className="container_login__">
            <Toast ref={toast} />
            <div className="container_login_votante p-fluid">
                <div className="container_login_votante_header">
                    <img src={logo} style={{ width: "17rem" }} alt="logo" />
                </div>
                <div className="item">
                    <label htmlFor="password" style={{ fontSize: "1.5rem" }}>
                        C??digo
                    </label>
                    <Password
                        inputStyle={{ fontSize: "1.5rem" }}
                        style={{ height: "4rem" }}
                        type={"number"}
                        id="password"
                        name="password"
                        value={codigo}
                        onChange={(e) => onInputChange(e)}
                        toggleMask
                        feedback={false}
                        required
                        autoFocus
                        className={classNames({ "p-invalid ": submitted && !codigo })}
                    />
                    {submitted && !codigo && (
                        <small style={{ fontSize: "1rem" }} className="p-invalid">
                            Se requiere un c??digo
                        </small>
                    )}
                </div>

                <div>
                    <Button label="Iniciar sesi??n" style={{ fontSize: "1.5rem" }} className="p-button-blue" onClick={saveUser} />
                </div>
            </div>
        </div>
    );
};

export default LoginVotante;
