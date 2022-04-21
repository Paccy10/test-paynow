import axios from "axios";
import { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    web: true,
    amount: "",
    phone: "",
    network: "",
    loading: false,
    message: "",
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onPay = async () => {
    try {
      this.setState({ loading: true, message: "" });
      let data = null;
      if (this.state.phone) {
        data = {
          phone: this.state.phone,
          network: this.state.network,
          amount: this.state.amount,
        };
      } else {
        data = {
          web: this.state.web,
          amount: this.state.amount,
        };
      }
      const res = await axios.patch(
        "http://localhost:9000/api/deed-reissuances/1/pay",
        data,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJmZWxpeC5ua3VuZGExQGdtYWlsLmNvbSIsImlhdCI6MTY1MDUzMjAyMywiZXhwIjoxNjUwNjE4NDIzfQ.rZQ4oTamDTK8mQuSrzVlpwRaLUOIhXRb_p7wMU8p8JQ",
          },
        }
      );
      console.log(res.data);
      const { pollUrl } = res.data;
      if (res.data.type === "web") {
        window.open(res.data.redirectUrl, "_blank");
      }

      const poll = () => {
        const callinterval = setInterval(async () => {
          const response = await axios.post(
            "http://localhost:9000/api/deed-reissuances/poll",
            { pollUrl, reissuanceId: 1 },
            {
              headers: {
                Authorization:
                  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJmZWxpeC5ua3VuZGExQGdtYWlsLmNvbSIsImlhdCI6MTY1MDUzMjAyMywiZXhwIjoxNjUwNjE4NDIzfQ.rZQ4oTamDTK8mQuSrzVlpwRaLUOIhXRb_p7wMU8p8JQ",
              },
            }
          );
          if (
            response.data.status === true &&
            response.data.message === "paid"
          ) {
            clearInterval(callinterval);
            this.setState({
              loading: false,
              message: "Payment made successful!",
            });
            return;
          }
          if (
            response.data.status === false &&
            response.data.message === "cancelled"
          ) {
            clearInterval(callinterval);
            this.setState({
              loading: false,
              message: "Payment got cancelled!",
            });
            return;
          }
        }, 15000);
      };
      poll();
    } catch (error) {
      console.log(error);
      if (error.response.status === 404 || error.response.status === 400) {
        this.setState({
          loading: false,
          message: error.response.data.message[0],
        });
      }
    }
  };

  render() {
    return (
      <div className="App">
        {this.state.message}
        {this.state.loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <div>
              <input
                type="text"
                name="amount"
                placeholder="Amount"
                value={this.state.amount}
                onChange={this.onChange}
              />
            </div>
            <div>
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={this.state.phone}
                onChange={this.onChange}
              />
            </div>
            <div>
              <input
                type="text"
                name="network"
                placeholder="Network"
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
