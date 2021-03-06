import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import './profile-view.scss';

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
      <Container className="profile-view wrapper container-fluid">
        <Row>
          <Col className="col-3" />
          <Col className="container-fluid align-items-center col-6">
            <img
              className="profile-avatar "
              src="https://via.placeholder.com/150"
            />
            <div className="account-username ">
              <span className="label">Username: </span>
              <span className="value">{profileInfo.Username}</span>
            </div>
            <div className="account-email ">
              <span className="label">Email: </span>
              <span className="value">{profileInfo.Email}</span>
            </div>
            <div className="account-birthday ">
              <span className="label">Birthday: </span>
              <span className="value">{profileInfo.Birthday}</span>
            </div>
            <div className="account-password ">
              <span className="label">Password: </span>
              <span className="value">***********</span>
            </div>
          </Col>
          <Col className="col-3" />
        </Row>
        <Container>
          <h4>Favourites List</h4>
          <div className="d-flex row mt-3 ml-1">
            {favouritesList.map((movie) => {
              return (
                <div key={movie._id}>
                  <Card className="mb-3 mr-2 h-100" style={{ width: '16rem' }}>
                    <Card.Img variant="top" src={movie.ImagePath} />
                    <Card.Body>
                      <Link className="text-muted" to={`/movies/${movie._id}`}>
                        <Card.Title>{movie.Title}</Card.Title>
                      </Link>
                      <Card.Text>
                        {movie.Description.substring(0, 90)}...
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="bg-white border-top-0">
                      <span className="d-flex align-items-center">
                        <Button
                          variant="primary"
                          size="sm"
                          className="mr-2"
                          onClick={() => this.removeFavourite(movie._id)}
                        >
                          <i className="material-icons bin">Remove</i>
                        </Button>
                      </span>
                    </Card.Footer>
                  </Card>
                </div>
              );
            })}
          </div>
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
