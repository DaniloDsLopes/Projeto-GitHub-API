import React from 'react'
import { BrowserRouter, Route, Routes as RoutesRD } from 'react-router-dom';
import Main from './pages/Main';
import Repositorio from './pages/Repositorio';

export default function Routes(){
    return (
    <BrowserRouter>
        <RoutesRD>
            <Route exact path="/" element={<Main/>}/>
            <Route exact path="/repositorio/:repositorio" element={<Repositorio/>}/>
        </RoutesRD>
    </BrowserRouter>
    );
    }