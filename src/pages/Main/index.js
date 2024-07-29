import React,{useState, useCallback, useEffect} from "react";
import { Container, Form, SubmitButton,List, DeleteButton } from './styles';
import {FaGithub, FaPlus, FaSpinner, FaBars, FaTrash} from 'react-icons/fa';
import api from '../../services/api';
import { Link } from "react-router-dom";


export default function Main(){

    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alerta, setAlerta] = useState(null);

    //DidMount = Buscar
    useEffect(()=>{
        const repoStorage = localStorage.getItem('repos');

        if(repoStorage){
            setRepositorios(JSON.parse(repoStorage));
        }
    },[]);

    
    //DidUpdate = Salvar alterações
    useEffect(()=>{
        localStorage.setItem('repos', JSON.stringify(repositorios))
    },[repositorios])

    function handleinputChange(e){
        setNewRepo(e.target.value);
        setAlerta(null);
    }

    const handleSubmit = useCallback((e)=>{
        e.preventDefault(e)
        async function submit(){
            setLoading(true);
            setAlerta(null);
            try{
                
                if(newRepo === ''){
                    alert("Você precisa indicar um repositorio!")
                    throw new Error('Você precisa indicar um repositorio!')
                }

                const response = await api.get(`repos/${newRepo}`)
                
                const hasRepo = repositorios.find(repo => repo.name === newRepo);

                if(hasRepo){
                    alert('Repositorio Duplicado');
                    throw new Error('Repositorio Duplicado');
                }

                const data ={
                    name: response.data.full_name,
                }
                
                setRepositorios([...repositorios, data])
                setNewRepo('');
            }catch(error){
                setAlerta(true);
                console.log(error);
            }finally{
                setLoading(false);
            }
        }

        submit();
    },[newRepo, repositorios]);

    const handleDelete = useCallback((repo)=> {
        const find = repositorios.filter(r => r.name !== repo);
        setRepositorios(find);
    }, [repositorios]);

    return(
        <Container>
            <h1>
                <FaGithub size={25}/>
                Meus Repositorios
            </h1>

            <Form onSubmit={handleSubmit} error={alerta}>
               <input type="text" placeholder="Adicionar Repositorios"
               value={newRepo}
               onChange={handleinputChange}
               /> 

               <SubmitButton loading={loading ? 1 : 0}>
                {loading ? (<FaSpinner color="#fff" size={14}/>) : 
                (<FaPlus color="#FFF" size={14}/>)}
               </SubmitButton>
            </Form>

            <List>
            {repositorios.map(repo =>(
                    <li key={repo.name}>
                        <span>
                            <DeleteButton onClick={()=>handleDelete(repo.name)}>
                                <FaTrash size={14}/>
                            </DeleteButton>{repo.name}
                        </span>
                        
                        <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                            <FaBars size={20}/>
                        </Link>
                    </li>
            ))}
            </List>
        </Container>
    );
}