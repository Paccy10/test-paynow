import axios from 'axios';
import { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    web: true,
    amount: '',
    phone: '',
    network: '',
    loading: false,
    message: ''
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onPay = async () => {
    this.setState({ loading: true, message: '' });
    let data = null;
    if (this.state.phone) {
      data = {
        phone: this.state.phone,
        network: this.state.network,
        amount: this.state.amount
      };
    } else {
      data = {
        web: this.state.web,
        amount: this.state.amount
      };
    }
    const res = await axios.patch(
      'http://localhost:5000/api/land-transfers/7/pay',
      data,
      {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJmYWJyaWNlLm1hbnppQGdtYWlsLmNvbSIsImlhdCI6MTYxODMwMjgwMywiZXhwIjoxNjE4Mzg5MjAzfQ.8wMp-v1uU9mZ8VATdU_9Q7WTem7NEgs1lGdc2iQwo6M'
        }
      }
    );
    const pollUrl = res.data.pollUrl;
    if (res.data.type === 'web') {
      window.open(res.data.redirectUrl, '_blank');
    }

    const poll = () => {
      const callinterval = setInterval(async () => {
        const response = await axios.post(
          'http://localhost:5000/api/land-transfers/poll',
          { pollUrl, landTransferId: 7 },
          {
            headers: {
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJmYWJyaWNlLm1hbnppQGdtYWlsLmNvbSIsImlhdCI6MTYxODMwMjgwMywiZXhwIjoxNjE4Mzg5MjAzfQ.8wMp-v1uU9mZ8VATdU_9Q7WTem7NEgs1lGdc2iQwo6M'
            }
          }
        );
        console.log(response);
        if (
          (response.data.status === true && response.data.message === 'paid') ||
          (response.data.status === false &&
            response.data.message === 'awaiting delivery')
        ) {
          clearInterval(callinterval);
          this.setState({
            loading: false,
            message: 'Payment made successful!'
          });
          return;
        }
        if (
          response.data.status === false &&
          response.data.message === 'cancelled'
        ) {
          clearInterval(callinterval);
          this.setState({
            loading: false,
            message: 'Payment got cancelled!'
          });
          return;
        }
      }, 3000);
    };
    poll();
  };

  render() {
    return (
      <div className='App'>
        {this.state.message}
        {this.state.loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <div>
              <input
                type='text'
                name='amount'
                placeholder='Amount'
                value={this.state.amount}
                onChange={this.onChange}
              />
            </div>
            <div>
              <input
                type='text'
                name='phone'
                placeholder='Phone'
                value={this.state.phone}
                onChange={this.onChange}
              />
            </div>
            <div>
              <input
                type='text'
                name='network'
                placeholder='Network'
                value={this.state.network}
                onChange={this.onChange}
              />
            </div>
            <button onClick={this.onPay}>Pay</button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
