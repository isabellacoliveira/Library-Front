import { useAutenticacao } from "../AutenticacaoProvider/AutenticacaoProvider";
import { createContext, useContext, useState } from "react";
import { Api } from "../../services/api";

export function useUsuario() {
  const contextoUsuario = useContext(UsuarioContext);
  return contextoUsuario;
}

const UsuarioContext = createContext({});
UsuarioContext.displayName = "Usuario Context";

export function UsuarioProvider({ children }) {
  const [usuario, setUsuario] = useState([]);
  const [userExist, setUserExist] = useState([]);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState([]);
  const { config, logout } = useAutenticacao();

  async function postUsuario(userData) {
    try {
      const response = await Api.post("user/register", userData);
      console.log('userData', userData)
      setUsuario(response.data);
    } catch (error) {
      throw error; 
    }
  }

  async function getUserById(id) {
    try {
      const response = await Api.get(`user/${id}`, config);
      return response.data.user;
    } catch (error) {
      throw error;
    }
  }

  async function editUsuario(id, userData){
    try{
      const response = await Api.put(`user/update/${id}`, userData, config)
      return response;
    } catch (error){
      throw error; 
    }
  }
  
  async function deleteUsuario(id) {
    try {
      await Api.delete(`user/delete/${id}`, config);
      logout();
    } catch (error) {
      console.log(error);
    }
  }
  
  async function forgotPasswordCheckUser(email){
    try {      
      const response = await Api.get(`user/check-email/${email}`);
      setUserExist(response)
    } catch (error){
      throw error; 
    }
  }

  async function updatePassword(email, newPassword, confirmNewPassword){
    try{
      const response = await Api.post('user/change-password',  { email, newPassword, confirmNewPassword });
      return response
    } catch (error){
      throw error; 
    }
  }

  return (
    <UsuarioContext.Provider
      value={{
        postUsuario,
        deleteUsuario,
        usuario,
        setUsuario,
        userExist,
        forgotPasswordCheckUser,
        updatePassword,
        isPasswordUpdated,
        setIsPasswordUpdated,
        editUsuario,
        getUserById
      }}
    >
      {children}
    </UsuarioContext.Provider>
  );
}