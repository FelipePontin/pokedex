import React, { useState, useEffect } from 'react';
import Aos from 'aos';
import 'aos/dist/aos.css';
import ScaleLoader from "react-spinners/ScaleLoader";
import './Pokedex.css';
import Logo from '../src/assets/logo.png'
import { AiFillHeart } from 'react-icons/ai';
import { FaSortDown } from "react-icons/fa";

import axios from 'axios';

const Pokedex = () => {

  const [pokemons, setPokemons] = useState([])
  const [selectedPokemon, setSelectedPokemon] = useState()
  const [isSelected, setIsSelected] = useState(false)
  const [favoritesId, setFavoritesId] = useState([])
  const [favorites, setFavorites] = useState([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [categoriesActive, setCategoriesActive] = useState([])
  const [categoriesPokemons, setCategoriesPokemons] = useState([])
  const [modalFilter, setModalFilter] = useState(false)
  const [filteredPokemons, setFilteredPokemons] = useState([])
  const [randomPokemon, setRandomPokemon] = useState()
  const [categories, setCategories] = useState(['grass', 'poison', 'fire', 'flying', 'water', 'bug', 'normal', 'electric', 'ground', 'fairy', 'fighting', 'psychic', 'rock', 'steel', 'ghost', 'ice', 'dragon'])
  const [isLoading, setIsLoading] = useState(false);
  const url = 'https://pokeapi.co/api/v2/pokemon?limit=151'

  const getAllPokemons = async () => {
    try {
      setIsLoading(true)

      const response = await axios.get(url)
      const results = response.data.results

      results.forEach(async pokemon => {
        const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
        const pokemonData = result.data

        setPokemons(pokemon => {
          pokemon = [...pokemon, pokemonData]
          pokemon.sort((a, b) => a.id > b.id ? 1 : -1)
          return pokemon
        })
      })
    }
    catch (error) {
      console.log(error)
    }
    finally {
      setIsLoading(false)
    }
  }

  const getSelectedPokemon = pokemon => {
    setSelectedPokemon(pokemon)
    setIsSelected(true)
  }

  const setFavoritePokemon = (pokemon) => {
    if (favoritesId.includes(pokemon)) {
      const index = favoritesId.indexOf(pokemon);
      const remover = favoritesId.filter((pok, i) => i !== index)
      setFavoritesId(remover)
    }
    else {
      setFavoritesId([...favoritesId, pokemon])
    }
  }

  const showFavoritePokemons = () => {
    if (!showFavorites) {
      const favoritePokemons = pokemons.filter((pok, i) => (favoritesId).includes(pok.id))
      setFavorites(favoritePokemons)
      setShowFavorites(true)
    }
    else {
      setShowFavorites(false)
    }
  }

  const addCategorie = (type) => {
    if (categoriesActive.includes(type)) {
      const removeCategorie = categoriesActive.filter(categorie => categorie !== type)
      setCategoriesActive(removeCategorie)
    }
    else {
      setCategoriesActive([...categoriesActive, type])
    }
  }

  const openModalFilter = () => {
    if (modalFilter === true) {
      setModalFilter(false)
    }
    else {
      setModalFilter(true)
      setFilteredPokemons([])
    }
  }

  const filterPokemons = (pokemonName) => {
    const pokemonsFiltrados = pokemons.filter(pokemon => (pokemon.name).includes(pokemonName))
    setFilteredPokemons(pokemonsFiltrados)
  }

  const getRandomPokemon = () => {
    let pokemonId = Math.floor(Math.random() * 151)
    if (pokemonId === 0) {
      pokemonId++
      setRandomPokemon(pokemons[pokemonId])
    }
    else {
      setRandomPokemon(pokemons[pokemonId])
    }
  }

  const getCategoriesPokemons = () => {
    const arrayPokemon = []
    pokemons.map(pokemon => {
      const typeInfo = (pokemon.types).map(types => types.type.name)
      categoriesActive.map(categorie => {
        if (typeInfo.includes(categorie)) {
          arrayPokemon.push(pokemon)
        }
      })
    })
    const pokemon = arrayPokemon.filter((poke, i) => arrayPokemon.indexOf(poke) === i);
    setCategoriesPokemons(pokemon)
  }

  useEffect(() => {
    Aos.init({ duration: 500 })
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
                <AiFillHeart className={!favoritesId.includes(selectedPokemon.id) ? 'star' : 'star starActive'} onClick={() => setFavoritePokemon(selectedPokemon.id)} />
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
      <div className='divisao_seta_topo' onClick={() => window.scroll(0, document.body.scrollHeight)}>
        <FaSortDown className='seta_topo' />
      </div>
      <div className='divisao_seta_baixo' onClick={() => window.scroll(0, 0)}>
        <FaSortDown className='seta_baixo' />
      </div>
      <section className={isSelected || modalFilter ? 'pokeapi pokeapiSelected' : 'pokeapi'}>
        <div className='logo' >
          <img className='logoImage' src={Logo} alt=''></img>
        </div>
        <div className='inputDivision'>
          <button className='btnFilter' onClick={() => openModalFilter()}>Filtrar</button>
        </div>
        <div className='pokedex'>
          {categoriesPokemons.length === 0 ?
            (showFavorites ?
              (favoritesId.length === 0 ?
                <section className='favoritesSection'>
                  <div className='favoritesDivision'>
                    <p className='favoritesSugestion'>Que tal esse?</p>
                    <img className='image' src={randomPokemon.sprites.other.home.front_default} alt=''></img>
                    <p className='randomPokemonName'>{randomPokemon.name}</p>
                    <AiFillHeart className={!favoritesId.includes(randomPokemon.id) ? 'star' : 'star starActive'} onClick={() => {
                      setFavoritePokemon(randomPokemon.id)
                      showFavoritePokemons()
                    }} />
                  </div>
                  <div className='noFavorites'>Você não tem pokemons favoritos.</div>
                </section>
                :
                favorites.map(pokemon => {
                  const typeInfo = (pokemon.types).map(types => types.type.name)
                  return (
                    <div data-aos='fade-up'>
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
                    </div>
                  )
                })
              )
              : filteredPokemons.length === 0 ?
                (pokemons.map(pokemon => {
                  const typeInfo = (pokemon.types).map(types => types.type.name)
                  return (
                    <div data-aos='fade-up'>
                      <div className='pokemon' onClick={() => getSelectedPokemon(pokemon)}>
                        {isLoading ?
                          <ScaleLoader color="#3761a8" />
                          :
                          <>
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
                          </>
                        }
                      </div>
                    </div>
                  )
                }))
                :
                (filteredPokemons.map(pokemon => {
                  const typeInfo = (pokemon.types).map(types => types.type.name)
                  return (
                    <div data-aos='fade-up'>
                      <div className='pokemon' onClick={() => getSelectedPokemon(pokemon)}>
                        <img className='image' src={pokemon.sprites.other.home.front_default} alt=''></img>

                        <div>
                          <div className='division'>
                            <h1 className='name'>{pokemon.name}</h1>
                            <span className='order'>#{pokemon.order}</span>
                          </div>
                          <ul className='types' key={pokemon}>
                            {typeInfo.map(type => {
                              return (
                                <li className={`type ${type}`}>{type}</li>
                              )
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                }))
            )
            :
            (categoriesPokemons.map((pokemon) => {
              const typeInfo = (pokemon.types).map(types => types.type.name)
              return (
                <div data-aos='fade-up'>
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
                </div>
              )
            }))
          }
        </div>
      </section>
      {modalFilter && (
        <div className='modalFilter' onClick={() => setModalFilter(false)}>
          <div className='filter' onClick={(e) => e.stopPropagation()}>
            <h1 className='filterTitle'>Filtrar</h1>
            <input className='input' type='text' placeholder='Procure por um Pokemon' onChange={(e) => {
              filterPokemons((e.target.value).toLowerCase())
              setCategoriesActive([])
              setCategoriesPokemons([])
            }
            }></input>
            <button className={showFavorites ? 'favoritos favoritosActive' : 'favoritos'} onClick={() => {
              getRandomPokemon()
              showFavoritePokemons()
              setCategoriesActive([])
              setCategoriesPokemons([])
            }}><AiFillHeart /></button>
            <button className='btnCategorie' onClick={() => getCategoriesPokemons()}>Atualizar categoria</button>
            <ul className='typesFilter'>
              {categories.map(type => {
                return (
                  <li className={categoriesActive.includes(type) ? `typeFilter ${type}` : 'typeFilter'} onClick={() => {
                    addCategorie(type)
                  }}>{type}</li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}

export default Pokedex;
