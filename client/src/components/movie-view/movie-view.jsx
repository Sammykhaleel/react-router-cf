import React from 'react';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';

export class MovieView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  addToFavourites(movie) {
    /* Send a request to the server for authentication */
    const url =
      'https://vfa.herokuapp.com/users/' +
      localStorage.getItem('id') +
      '/favourites/' +
      movie; // 'https://vfa.herokuapp.com/users/localStorage.getItem('user')}/favourites/${movie}';
    axios
      .post(
        url,
        {},
        {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }, //  `Bearer ${localStorage.getItem('token')}`
        }
      )
      .then((response) => {
        const data = response.data;
        console.log(data);
        // Send data to prop
        alert('Movie added to favourites');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { movie } = this.props;

    if (!movie) return null;

    return (
      <Container className="wrapper container-fluid">
        <Row>
          <Col className="col-3" />
          <div className="movie-view container-fluid align-items-center col-6">
            <img className="movie-poster " src={movie.ImagePath} />
            <div className="movie-title ">
              <span className="label">Title: </span>
              <span className="value">{movie.Title}</span>
            </div>
            <div className="movie-description ">
              <span className="label">Description: </span>
              <span className="value">{movie.Description}</span>
            </div>
            <div className="movie-genre ">
              <span className="label">Genre: </span>
              <Link to={`/genres/${movie.Genre.Name}`}>
                <Button variant="link">{movie.Genre.Name}</Button>
              </Link>
            </div>
            <div className="movie-director ">
              <span className="label">Director: </span>
              <Link to={`/directors/${movie.Director.Name}`}>
                <Button variant="link">{movie.Director.Name}</Button>
              </Link>
            </div>
            <div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => this.addToFavourites(movie._id)}
              >
                Add to Favourites
              </Button>
            </div>
            <Link to={`/`}>
              <Button variant="link">Return</Button>
            </Link>
          </div>
          <Col className="col-3" />
        </Row>
      </Container>
    );
  }
}

MovieView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
    Genre: PropTypes.shape({
      Name: PropTypes.string.isRequired,
    }),
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired,
    }),
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};
