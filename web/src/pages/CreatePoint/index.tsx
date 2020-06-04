import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import './styles.css';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import logo from '../../assets/logo.svg';
import { Map, TileLayer, Marker } from 'react-leaflet';
import api from '../../services/api';

//estado pra um array ou objeto: precisa manualmente informar o tipo da variável "useState<string[]>([])"
//precisa criar uma interface e informar para o useState essa tipagem por meio do parâmetro <>
//nota: lembrar que quando é feito um map no react o primeiro item tem que conter
//a propriedade única "key"

/*
!!! IMPORTANTE
  Utilizar o id da cidade ao invés do nome
*/

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}
interface IBGECityResponse {
  nome: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  //pegando os itens da api do backend
  useEffect(() => {
    api.get('items').then((response) => {
      setItems(response.data);
    });
  }, []);

  //pegando os estados da api do IBGE
  //https://servicodados.ibge.gov.br/api/docs/localidades?versao=1#api-_
  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome',
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);
  //pegando a cidade da api do IBGE
  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }
    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/distritos?orderBy=nome`,
      )
      .then((response) => {
        const cities = response.data.map((city) => city.nome);
        setCities(cities);
      });
  }, [selectedUf]);

  //precisa passar para a função o tipo do event e oque está sendo alterado
  function handleSelecUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectedUf(uf);
  }
  function handleSelecCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form action="">
        <h1>
          Cadastro do <br /> ponto de coleta
        </h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name" />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={[-22.8935547, -43.3092406]} zoom={15}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[-22.8935547, -43.3092406]} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectedUf}
                onChange={handleSelecUf}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelecCity}
              >
                <option value="0">Selecione uma Cidade</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>
          <ul className="items-grid">
            {items.map((item) => {
              return (
                <li key={item.id}>
                  <img src={item.image_url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              );
            })}
          </ul>
        </fieldset>
        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
