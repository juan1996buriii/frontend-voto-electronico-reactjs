import axios from "axios";
import authHeader from "./auth-header";

const url = "http://localhost:9090/api/v1.0/lista/";

export class ListaService {
    getListas(ruc, state) {
        return axios
            .get(url, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    state(res.data.result.filter((item) => item.procesoEleccion.institucion.ruc === ruc));
                    return res.data.result.filter((item) => item.procesoEleccion.institucion.ruc === ruc);
                }
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }

    getListasAVotar(votante) {
        return axios
            .get(url)
            .then((res) => {
                if (res.data.success) {
                    const data = res.data.result;
                    const listas = data.filter((item) => item.procesoEleccion.institucion.id === votante.institucion.id);
                    return listas;
                }
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }
    postLista(data) {
        return axios
            .post(url, data, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    return res.data.result;
                }
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }
    updateLista(data) {
        return axios.put(url, data, { headers: authHeader() }).catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
    }
    deleteLista(id) {
        return axios
            .delete(url + id, { headers: authHeader() })
            .then((resp) => resp.data.success)
            .catch(function (error) {
                return error.response.data.status;
            });
    }
}
