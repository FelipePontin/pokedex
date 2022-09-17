import React, { useState, useEffect } from 'react';
import './Pokedex.css';
import axios from 'axios';

const Pokedex = () => {

  const [pokemons, setPokemons] = useState([])
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

  useEffect(() => {
    getAllPokemons()
  }, [])

  return (
    <section class='pokedex'>
      {pokemons.map(pokemon => {
        const typeInfo = (pokemon.types).map(types => types.type.name)
        return (
          <div class='pokemon'>
            <img class='image' src={pokemon.sprites.other.home.front_default}></img>
            <div>
              <div class='division'>
                <h1 class='name'>{pokemon.name}</h1>
                <span class='order'>#{pokemon.order}</span>
              </div>
              <ul class='types'>
                {typeInfo.map(type => {
                  return (
                    <li class={`type ${type}`}>{type}</li>
                  )
                })}
              </ul>
            </div>
          </div>
        )
      })}
    </section>
  )
}

export default Pokedex;
