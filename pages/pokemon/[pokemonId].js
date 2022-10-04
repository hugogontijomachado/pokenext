import Image from "next/image"
import styles from "../../styles/Pokemon.module.css"
import { useRouter } from "next/router"

export const getStaticPaths = async() => {
    const maxPokemons = 251
    const api = 'http://pokeapi.co/api/v2/pokemon'
    const res = await fetch(`${api}/?limit=${maxPokemons}`)
    const data = await res.json()
    
    //params
    const paths = data.results.map((pokemon,index) => {
        return {
            params: {pokemonId:(index+1).toString()},
        }
    })
    console.log("paths:", paths)

    return {
        paths,
        fallback: true,
    }
}

export const getStaticProps = async(context) => {
    const id = context.params.pokemonId
    console.log(id)
    
    const res = await fetch(`http://pokeapi.co/api/v2/pokemon/${id}`)

    const data = await res.json()

    return {
        props: { pokemon: data, context:context.params }
    }

}

export default function Pokemon(props) {
    const router = useRouter()
    
    const { pokemon, context } = props

    /* o GetStaticPaths serve para retornar uma lista de parâmetros pra pre-renderização de páginas
       estáticas no momento do build, onde cada item na lista será enviado como um parâmetro no contexto
       para a função getStaticProps realizar as operações necessárias e renderizar página por página
            fluxo: params do item[0] na lista de retorno de getStaticPaths --> entregue como contexto para
            a função getStaticProps, que realiza as ações necessárias e chama esta função para renderizar 
            o componente. O nº de páginas geradas será o tamanho da lista retornada.

       - Quando usamos a saida fallback: false, as páginas listadas serão renderizadas e não será permitido ao
       usuário tentar renderizar outras páginas com parâmetros não previstos no getStaticPaths, ou seja, a função
       getStaticProps não será executada nunca pelo usuário
       - Entretanto, se retornamos fallback:true em getSidePaths, permitiremos ao usuário utilizar parâmetros não 
       previstos e a renderização será feita na hora. Isso acontece da seguinte maneira: esta função do componente
       é chamada inicialmente; uma tela de carregamento pode ser renderizada ao invés do componente, caso o fallback seja
       true. O fallback sendo true, após esta primeira renderização do componente, a função getStaticProps será executada
       com o contexto contendo o parâmetro do usuário, ao finalizar irá executar esta função de renderização do componente,
       agora com o fallback ja sendo false e com as novas props pra renderizar a nova página dinamicamente
    */
    if(router.isFallback){
        return <div>Carregando...</div>
    }
    return (
        <div className={styles.pokemon_container}>
            <h1 className={styles.title}>{pokemon.name}</h1>
            <Image 
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                width="200"
                height="200"
                alt={pokemon.name}
            />
            <div>
                <h3>Número:</h3>
                <p>#{pokemon.id}</p>
            </div>
            <div>
                <h3>Tipo:</h3>
                <div className={styles.types_container}>
                    {pokemon.types.map((item,index) => (
                        <span key={index} className={`${styles.type} ${styles['type_' + item.type.name]}`}>
                            {item.type.name}
                        </span>
                    ))}
                </div>
            </div>
            <div className={styles.data_container}>
                <div className={styles.data_height}>
                    <h4>Altura:</h4>
                    <p>{pokemon.height * 10} cm</p>
                </div>
                <div className={styles.data_weight}>
                    <h4>Peso:</h4>
                    <p>{pokemon.weight / 10} kg</p>
                </div>
            </div>
        </div>
    )
}