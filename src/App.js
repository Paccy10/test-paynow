import axios from "axios";
import { Component } from "react";
import "./App.css";
import FileDownload from "js-file-download";

class App extends Component {
  state = {
    web: true,
    amount: "",
    phone: "",
    network: "",
    loading: false,
    message: "",
    tokens: "",
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
        "http://localhost:8000/api/transfers/114/pay",
        data,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJjb252ZXlhbmNlci5vbmVAZ21haWwuY29tIiwiaWF0IjoxNjM4MTc1OTUyLCJleHAiOjE2MzgyNjIzNTJ9.iaQqTpk0spMbYLTe9HthTz14_Zf9IJCOl_AvCIvwWmE",
          },
        }
      );
      const pollUrl = res.data.pollUrl;
      if (res.data.type === "web") {
        window.open(res.data.redirectUrl, "_blank");
      }

      const poll = () => {
        const callinterval = setInterval(async () => {
          const response = await axios.post(
            "http://localhost:8000/api/transfers/poll",
            { pollUrl, transferId: 114 },
            {
              headers: {
                Authorization:
                  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJjb252ZXlhbmNlci5vbmVAZ21haWwuY29tIiwiaWF0IjoxNjM4MTc1OTUyLCJleHAiOjE2MzgyNjIzNTJ9.iaQqTpk0spMbYLTe9HthTz14_Zf9IJCOl_AvCIvwWmE",
              },
            }
          );
          console.log(response);
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
      if (error.response.status === 404 || error.response.status === 400) {
        this.setState({
          loading: false,
          message: error.response.data.message[0],
        });
      }
    }
  };

  onPayTokens = async () => {
    try {
      this.setState({ loading: true, message: "" });
      let data = null;
      if (this.state.phone) {
        data = {
          phone: this.state.phone,
          network: this.state.network,
          tokens: this.state.tokens,
        };
      } else {
        data = {
          web: this.state.web,
          tokens: this.state.tokens,
        };
      }
      const res = await axios.patch(
        "http://localhost:5000/api/users/conveyancers/tokens/pay",
        data,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzdXBlci1hZG1pbkB6aW1jb25uZWN0LmNvbSIsImlhdCI6MTYyNzI4NzA0OSwiZXhwIjoxNjI3MzczNDQ5fQ.si_yJD0GeWCIlFO__MeV-BjVUEdB0-ulwrMO0cTqOvs",
          },
        }
      );
      const { pollUrl, tokens } = res.data;
      if (res.data.type === "web") {
        window.open(res.data.redirectUrl, "_blank");
      }

      const poll = () => {
        const callinterval = setInterval(async () => {
          const response = await axios.post(
            "http://localhost:5000/api/users/conveyancers/tokens/poll",
            { pollUrl, tokens },
            {
              headers: {
                Authorization:
                  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzdXBlci1hZG1pbkB6aW1jb25uZWN0LmNvbSIsImlhdCI6MTYyNzI4NzA0OSwiZXhwIjoxNjI3MzczNDQ5fQ.si_yJD0GeWCIlFO__MeV-BjVUEdB0-ulwrMO0cTqOvs",
              },
            }
          );
          console.log(response);
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
      if (error.response.status === 404 || error.response.status === 400) {
        this.setState({
          loading: false,
          message: error.response.data.message[0],
        });
      }
    }
  };

  onDownload = () => {
    axios({
      url: "http://localhost:5000/api/transfers/1/generate-deed",
      method: "GET",
      responseType: "blob",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJjb252ZXlhbmNlci5vbmVAZ21haWwuY29tIiwiaWF0IjoxNjM4MTc1OTUyLCJleHAiOjE2MzgyNjIzNTJ9.iaQqTpk0spMbYLTe9HthTz14_Zf9IJCOl_AvCIvwWmE",
      },
    }).then((response) => {
      FileDownload(response.data, "file.pdf");
    });
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
            <div>
              <input
                type="text"
                name="tokens"
                placeholder="Tokens"
                value={this.state.tokens}
                onChange={this.onChange}
              />
            </div>
            <button onClick={this.onPay}>Pay</button>
            <button onClick={this.onDownload}>Download</button>
            <button onClick={this.onPayTokens}>Pay Tokens</button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
