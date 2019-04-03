import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

class Feed extends React.Component {
    render() {
        if(this.props.error){
             return (
                <div>No hay tweets</div>
            );
        }
        else {
            return (
               this.props.publicaciones.map(publicacion => <Estados publicacion={publicacion} />)
            );
        }
    }
}

class Barra extends React.Component {
    constructor(props){
		super(props);
		this.myRef = React.createRef();
		this.myClick = this.myClick.bind(this);
		this.state = {
			user: 'Pepe',
			avatar: 'https://www.tuexperto.com/wp-content/uploads/2015/07/perfil_01.jpg',
			post: ''
		};
    }
    
    myClick(){
		this.props.click(null, this.state.user, this.state.avatar, this.myRef.current.value);
		this.myRef.current.value = '';
		this.myRef.current.focus();
	}

    render() {
        return (
            <div className="barra_texto">
                <div className="img_perfil">
                    <img src={this.state.avatar} />
                </div>
                <div className="Nombre">
                    <h3>{this.state.user}</h3>
                </div>
                <div className="textarea">
                    <textarea className='txtarea' type='text' placeholder='Que estas pensando' ref={this.myRef} />
                </div>
                <div className="btnpublicar">
                    <button onClick={this.myClick}>Publicar</button>
                </div>
            </div>
        );
    }
}

class Estados extends React.Component {
    render() {
        return (
            <div key={this.props.publicacion.id}>
                <div className="img_perfil">
                    <img src={this.props.publicacion.avatar} />
                </div>
                <div className="Nombre">
                    <h3>{this.props.publicacion.user_name}</h3>
                </div>
                <div className="estado">
                    <p>{this.props.publicacion.description}</p>
                </div>
            </div>  
        );
    }
}

class Facebook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            publicaciones : [],
            isLoaded: false
        };
    }

    handleClick(e, user, avatar, post){
        console.log({user, avatar, post});
        debugger;
        this.setState({
        	isLoaded: false
        });
        let newEstado = {
        	user_name: user,
        	avatar: avatar,
        	description: post
        }
        console.log(newEstado);
        debugger;
        let headers = {};
        headers['Content-Type'] = 'application/json';
        const options = {
            headers: headers,
            method: 'POST',
            body: JSON.stringify(newEstado)
        };
        fetch('#', options)
            .then(res => res.json())
            .then(
                result => {
                    let newEstado = result.draft_tweet;
                    let tweets = this.state.tweets.slice();
                    this.setState({
                        isLoaded: true,
                        tweets: tweets.concat(newEstado)
                    });
                },
                error => {
                    this.setState({
                        isLoaded: false,
                        error: error
                    });
                }
            );
    }

    componentDidMount() {
        fetch("https://still-garden-88285.herokuapp.com/draft_tweets")
            .then(res => res.json())
            .then(
                result => {
                    this.setState({
                    isLoaded: true,
                    publicaciones:result.draft_tweets
            });
            },
            error => {
            this.setState({
                isLoaded: true,
                error: error
            });
            }
        );
    }

    render() {
    const { error, isLoaded, publicaciones } = this.state;
        return (
            <div className="main">
                <Barra click={this.handleClick} />
                <Feed error={error} publicaciones={publicaciones}/>      
            </div>
        );
    }
}

ReactDOM.render(
    <Facebook />,
    document.getElementById('root')
);