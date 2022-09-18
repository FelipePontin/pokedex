import React, { useState, useEffect } from 'react';
import './Pokedex.css';
import axios from 'axios';

const Pokedex = () => {

  const [pokemons, setPokemons] = useState([])
  const [selectedPokemon, setSelectedPokemon] = useState()
  const [isSelected, setIsSelected] = useState(false)
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

  useEffect(() => {
    getAllPokemons()
  }, [])

  return (
    <>
      {isSelected && (
        <div className='modal' onClick={() => setIsSelected(false)}>
          <div className='pokemonSelected'>
            <img className='imageSelected' src={selectedPokemon.sprites.other.home.front_default}></img>
            <div className='divisionSelected'>
              <h1 className='nameSelected'>{selectedPokemon.name}</h1>
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
      <section className={!isSelected ? 'pokedex' : 'pokedex pokedexSelected'}>
        {pokemons.map(pokemon => {
          const typeInfo = (pokemon.types).map(types => types.type.name)
          return (
            <div className='pokemon' onClick={() => getSelectedPokemon(pokemon)}>
              <img className='image' src={pokemon.sprites.other.home.front_default}></img>
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
      </section>
    </>
  )
}

export default Pokedex;
