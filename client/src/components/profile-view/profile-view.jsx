import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

export class ProfileView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  removeFavourite(movie) {
    /* Send a request to the server for authentication */
    const url =
      'https://vfa.herokuapp.com/users/' +
      localStorage.getItem('id') +
      '/favourites/' +
      movie; // 'https://vfa.herokuapp.com/users/localStorage.getItem('user')}/favourites/${movie}';
    axios
      .delete(url, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }, //  `Bearer ${localStorage.getItem('token')}`
      })
      // reload page
      .then(() => {
        document.location.reload(true);
      })
      .then(() => {
        alert('Movie removed from favourites');
      })
      .catch((error) => {
        console.log('Issue deleting movie from favourites... >' + error);
      });
  }

  unregisterAccount() {
    if (!confirm('Are you sure?')) {
      return;
    }
    const url = 'https://vfa.herokuapp.com/users/' + localStorage.getItem('id');
    console.log(url);
    axios
      .delete(url, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      })
      .then((response) => {
        console.log(response.data);
        // Set profile info to null
        this.setState({
          profileInfo: null,
          user: null,
        });
        this.props.logOutFunc();
        window.open('/', '_self');
        alert('Your account was successfully deleted');
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    const { user, profileInfo, movies } = this.props;
    if (!profileInfo || !user) return <div>Loading</div>;
    console.log(profileInfo.FavouriteMovies);
    const favouritesList = movies.filter((movie) =>
      profileInfo.FavouriteMovies.includes(movie._id)
    );
    console.log('FL =' + favouritesList);

    return (
      <Container className="profile-view align-items">
        <Row xs={6}>
          {' '}
          <img
            className="profile-avatar "
            src="https://via.placeholder.com/150"
          />
        </Row>
        <Row>
          <Col>
            <Row className="account-username ">
              <span className="label">Username: </span>
              <span className="value">{profileInfo.Username}</span>
            </Row>
            <Row className="account-email ">
              <span className="label">Email: </span>
              <span className="value">{profileInfo.Email}</span>
            </Row>
            <Row className="account-birthday ">
              <span className="label">Birthday: </span>
              <span className="value">{profileInfo.Birthday}</span>
            </Row>
            <Row className="account-password ">
              <span className="label">Password: </span>
              <span className="value">***********</span>
            </Row>
          </Col>
        </Row>
        <Container>
          <h4>Favourites List</h4>
          <Row>
            <ul>
              {favouritesList.map((movie) => (
                <li key={movie._id} className="mb-2 ">
                  <span className="d-flex align-items-center">
                    <Button
                      variant="primary"
                      size="sm"
                      className="delete-movie mr-2"
                      onClick={() => this.removeFavourite(movie._id)}
                    >
                      <i className="material-icons bin">Remove</i>
                    </Button>
                    <Link to={`/movies/${movie._id}`}>
                      <h5 className="movie-link link">{movie.Title}</h5>
                    </Link>
                  </span>
                </li>
              ))}
            </ul>
          </Row>
        </Container>
        <Row>
          <Col>
            <Link to={`/update/${profileInfo.Username}`}>
              <Button variant="primary" className="update-button">
                Update my profile
              </Button>
            </Link>
            <div className="">
              <Button onClick={() => this.unregisterAccount()} variant="link">
                Delete Account
              </Button>
            </div>
            <Link to={`/`}>
              <Button variant="link">Home</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }
}

ProfileView.propTypes = {
  profileInfo: PropTypes.shape({
    Username: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    // ImagePath: PropTypes.string.isRequired,
    Birthday: PropTypes.string.isRequired,
  }).isRequired,
  logOutFunc: PropTypes.func.isRequired,
};