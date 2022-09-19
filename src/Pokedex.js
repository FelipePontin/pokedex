import React, { useState, useEffect } from 'react';
import './Pokedex.css';
import Logo from '../src/assets/logo.png'
import { AiOutlineHeart } from 'react-icons/ai';
import { AiFillHeart } from 'react-icons/ai';
import axios from 'axios';

const Pokedex = () => {

  const [pokemons, setPokemons] = useState([])
  const [selectedPokemon, setSelectedPokemon] = useState()
  const [isSelected, setIsSelected] = useState(false)
  const [favorites, setFavorites] = useState([])
  const url = 'https://pokeapi.co/api/v2/pokemon?limit=151'

  const getAllPokemons = async () => {
    axios.get(url)
      .then(response => {
        const { results } = response.data

        results.map(async (pokemon) => {
          const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)

          setPokemons(status => {
            status = [...status, result.data]
            status.sort((a, b) => a.id > b.id ? 1 : -1)

            return status
          })

        })
      })
      .catch(() => {
        console.log('Erro!')
      })
  }

  const getSelectedPokemon = pokemon => {
    setSelectedPokemon(pokemon)
    setIsSelected(true)
  }

  const setFavoritePokemon = (pokemon) => {
    if(favorites.includes(pokemon)) {
      const index = favorites.indexOf(pokemon);
      const remover = favorites.filter((pok, i) => i !== index)
      setFavorites(remover)
    }
    else {
      setFavorites([...favorites, pokemon])
    }
  }

  useEffect(() => {
    getAllPokemons()
  }, [])

  return (
    <>
      {isSelected && (
        <div className='modal' onClick={() => setIsSelected(false)}>
          <div className='pokemonSelected' onClick={(e) => e.stopPropagation()}>
            <img className='imageSelected' src={selectedPokemon.sprites.other.home.front_default} alt=''></img>
            <div className='divisionSelected'>
              <div className='divisionNameSelected'>
                <h1 className='nameSelected'>{selectedPokemon.name}</h1>
                <AiFillHeart className={!favorites.includes(selectedPokemon.id) ? 'star' : 'star starActive'} onClick={() => setFavoritePokemon(selectedPokemon.id)} />
              </div>
              {(selectedPokemon.stats).map(pokemon => {
                return (
                  <div className='divisionStatus'>
                    <span className='nameStatus'>{pokemon.stat.name}</span>
                    <span className='valueStatus'>{pokemon.base_stat}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
      <section className={!isSelected ? 'pokeapi' : 'pokeapi pokeapiSelected'}>
        <div className='logo' >
          <img src={Logo} alt=''></img>
        </div>
        <div class='inputDivision'>
          <input className='input' type='text' placeholder='Procure por um Pokemon'></input>
        </div>
        <div className='pokedex'>
          {pokemons.map(pokemon => {
            const typeInfo = (pokemon.types).map(types => types.type.name)
            return (
              <div className='pokemon' onClick={() => getSelectedPokemon(pokemon)}>
                <img className='image' src={pokemon.sprites.other.home.front_default} alt=''></img>
                
                <div>
                  <div className='division'>
                    <h1 className='name'>{pokemon.name}</h1>
                    <span className='order'>#{pokemon.order}</span>
                  </div>
                  <ul className='types'>
                    {typeInfo.map(type => {
                      return (
                        <li className={`type ${type}`}>{type}</li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}

export default Pokedex;
