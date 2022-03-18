import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types';
import { post } from './components/network'
import { validateEmail, validatePhone } from './components/validate'

class BoontarTVInputs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_get: props.getId,
      name: "",
      email: "",
      phone: "",
      form: [],
      inputList: [],
      id_user: 0,

      statusVisible: props.statusVisible,
      sending: false,
      status: null, //success, failed, required, validate
      done: false,

      description: '',
      title: '',
      button_text: '',
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    post({
      url: `form/${this.state.id_get}`,
      body: {
        token: this.props.apiKey
      }
    })
      .then((data) => {
        if (data.status === 'success') {
          this.formChangeTypes(data.form);
          this.setState({
            id_user: data.id_user,
            publish: data.publish,
            done: true
          }, () => {
            const start_ = () => {
              this.inputListDefaultValues(data.form);
              this.setState({
                description: data.description,
                title: data.title,
                button_text: data.button_text,
              });
              this.onLoad()
            }
            if (this.state.publish === 'enabled') {
              start_()
            }
          })
        }
      })
      .catch((e) => {
        this.onLoadFailed()
      });
  }

  inputListDefaultValues = (form) => {
    let list = this.state.inputList;
    for (var index = 0; index < form.length; ++index) {
      list[index] = {
        name: form[index].inputName,
        value: '',
        type: form[index].inputType,
        tag: form[index].tag,
        required: form[index].required,
      };
      if (form[index].inputType === 'datetime-local') {
        list[index].value = '2022-01-01T00:00';
      };
      if (form[index].inputType === 'date') {
        list[index].value = '2022-01-01';
      };
      if (form[index].inputType === 'time') {
        list[index].value = '00:00';
      };
    };
    this.setState({ inputList: list });
  }

  formChangeTypes = (form) => {
    let formInputs = this.state.form;
    for (let index = 0; index < form.length; index++) {
      formInputs[index] = {
        inputName: form[index].inputName,
        inputType: form[index].inputType,
        tag: form[index].tag,
        required: form[index].required,
      };
      if (form[index].inputType === 'datetime-local') {
        formInputs[index].inputType = 'default';
      }
      if (form[index].inputType === 'date') {
        formInputs[index].inputType = 'default';
      }
      if (form[index].inputType === 'time') {
        formInputs[index].inputType = 'default';
      }
      if (form[index].inputType === 'string') {
        formInputs[index].inputType = 'default';
      }
      if (form[index].inputType === 'email') {
        formInputs[index].inputType = 'email-address';
      }
      if (form[index].inputType === 'tel') {
        formInputs[index].inputType = 'phone-pad';
      }
    }
    this.setState({ form: formInputs });
  }

  onSuccess = () => {
    if (this.props.onSuccess) {
      this.props.onSuccess();
    }
  }

  onFailed = (error) => {
    if (this.props.onFailed) {
      this.props.onFailed(error);
    }
  }

  onLoad = () => {
    if (this.props.onLoad) {
      this.props.onLoad();
    }
  }

  onLoadFailed = () => {
    if (this.props.onLoadFailed) {
      this.props.onLoadFailed();
    }
  }

  submit = () => {
    if (this.state.sending) return;

    this.setState({
      sending: true,
    }, () => {
      var custom_inputs = [];
      for (var i = 0; i < this.state.inputList.length; i++) {
        if (this.state.inputList[i].tag === "custom") {
          custom_inputs.push(this.state.inputList[i])
        }
        if (this.state.inputList[i].required === true && this.state.inputList[i].value.length <= 0) {
          this.onFailed(2)
          this.setState({
            status: 'required',
            sending: false
          })
          return;
        }
        if (this.state.inputList[i].value.length > 0 && (this.state.inputList[i].tag === "email" || this.state.inputList[i].type === "email") && !validateEmail(this.state.inputList[i].value)) {
          this.onFailed(3)
          this.setState({
            status: 'validate',
            sending: false,
          })
          return;
        }
        if (this.state.inputList[i].value.length > 0 && (this.state.inputList[i].tag === "phone" || this.state.inputList[i].type === "tel") && !validatePhone(this.state.inputList[i].value)) {
          this.onFailed(4)
          this.setState({
            status: 'validate',
            sending: false,
          })
          return;
        }
      }

      let name, email = '';
      let phone = 0;
      if (this.state.name !== '') {
        name = this.state.name
      }
      name = null;
      if (this.state.email !== '') {
        email = this.state.email
      }
      email = null;
      if (this.state.phone > 0) {
        phone = this.state.phone
      }
      phone = null;

      post({
        url: 'request',
        body: {
          name: name,
          email: email,
          phone: phone,
          custom: JSON.stringify(custom_inputs),
          client_id: "0",
          id_get: this.state.id_get,
          token: this.props.apiKey
        }
      })
        .then((data) => {
          if (data.status === 'success') {
            this.setState({ status: 'success' }, () => {
              this.onSuccess()
            })
          } else {
            this.setState({ status: 'failed' }, () => {
              this.onFailed(1)
            })
          }
          this.setState({
            sending: false,
          })
        })
        .catch((e) => {
          this.setState({
            status: 'failed',
            sending: false,
          })
        });
    });
  }

  returnButton = () => {
    return (
      <TouchableOpacity
        onPress={() => this.submit()}
        activeOpacity={0.6}
        style={[styles.BoontarTVFormButton, { backgroundColor: this.state.sending ? '#404040' : '#fd3d48' }, this.props.submitButton]}
      >
        <Text style={[styles.BoontarTVFormButtonText, this.props.submitButtonText]}>
          {this.state.button_text}
        </Text>
      </TouchableOpacity>
    );
  };

  successText = () => this.props.successStatus ? this.props.successStatus : "Form sent successfully";

  failedText = () => this.props.failedStatus ? this.props.failedStatus : "Failed to submit form";

  requiredText = () => this.props.requiredStatus ? this.props.requiredStatus : "You have not filled in the required fields";

  validateText = () => this.props.validateStatus ? this.props.validateStatus : "Check the correctness of the filled data";

  status = () => {
    if (!this.state.statusVisible) return null;

    switch (this.state.status) {
      case 'success':
        return (<Text style={[styles.BoontarTVSuccessStatus, this.props.successText]}>{this.successText()}</Text>)

      case 'failed':
        return (<Text style={[styles.BoontarTVFailedStatus, this.props.failedText]}>{this.failedText()}</Text>)

      case 'required':
        return (<Text style={[styles.BoontarTVFailedStatus, this.props.failedText]}>{this.requiredText()}</Text>)

      case 'validate':
        return (<Text style={[styles.BoontarTVFailedStatus, this.props.failedText]}>{this.validateText()}</Text>)

      default:
        break;
    }
  }

  returnInputs = () => {
    if (this.state.form.length === 0 || this.state.inputList.length === 0) return null;

    return this.state.form.map((l, i) => {
      if (l.inputType === 'select') {
        return; //TO DO
      }
      if (l.inputType === 'slider') {
        return; //TO DO
      }
      if (l.inputType === 'datetime-local' || l.inputType === "date" || l.inputType === "time") {
        return; //TO DO
      }
      return this.textInput(l, i);
    })
  }

  handleInputChange = (text, index) => {
    this.state.inputList[index].value = text;
    this.setState({ inputList: this.state.inputList }, () => {
      if (this.state.inputList[index].tag === 'name') {
        this.setState({
          name: text,
        });
      };
      if (this.state.inputList[index].tag === 'email') {
        this.setState({
          email: text,
        });
      };
      if (this.state.inputList[index].tag === 'phone') {
        this.setState({
          phone: text,
        });
      };
    });
  };

  textInput = (l, i) => {
    return (
      <TextInput
        id={'boontar-tv-input-lead-form'}
        key={i}
        required={l.required}
        keyboardType={l.inputType}
        placeholder={l.inputName + (l.required ? '*' : '')}
        value={this.state.inputList[i].value}
        style={[styles.BoontarTVInput, this.props.input]}
        placeholderTextColor={'#898989'}
        onChangeText={text => this.handleInputChange(text, i)}
      />
    )
  }

  render() {
    return (
      <View style={[styles.BoontarTVForm, this.props.container]}>
        <Text style={[styles.BoontarTVTitle, this.props.title]}>{this.state.title}</Text>
        <Text style={[styles.BoontarTVDescription, this.props.description]}>{this.state.description}</Text>
        <View style={[styles.BoontarTVInputsBox, this.props.inputsContainer]}>
          {this.returnInputs()}
        </View>
        <View style={[styles.BoontarTVButtonBox, this.props.buttonContainer]}>
          {this.status()}
          {this.returnButton()}
        </View>
      </View>
    );
  }
}

BoontarTVInputs.propTypes = {
  getId: PropTypes.number,
  apiKey: PropTypes.string,
  statusVisible: PropTypes.bool,

  inputLabel: PropTypes.string,
  input: PropTypes.string,
  submitButton: PropTypes.string,
  submitButtonText: PropTypes.string,
  successText: PropTypes.string,
  failedText: PropTypes.string,
  container: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  inputsContainer: PropTypes.string,
  buttonContainer: PropTypes.string,
  placeholderTextColor: PropTypes.string,

  successStatus: PropTypes.string,
  failedStatus: PropTypes.string,
  requiredStatus: PropTypes.string,
  validateStatus: PropTypes.string,

  onSuccess: PropTypes.func,
  onFailed: PropTypes.func,
  onLoad: PropTypes.func,
  onLoadFailed: PropTypes.func,
};

const styles = StyleSheet.create({
  BoontarTVForm: {
    backgroundColor: '#313131',
    padding: 10,
    height: '100%',
  },

  BoontarTVTitle: {
    color: 'white',
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  BoontarTVDescription: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },

  BoontarTVInput: {
    width: '100%',
    marginTop: 15,
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 14,
    backgroundColor: '#404040',
    color: 'white',
    borderWidth: 0,
    borderRadius: 5,
  },

  BoontarTVFormButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#fd3d48',
    borderWidth: 0,
    borderRadius: 5,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  BoontarTVFormButtonText: {
    color: 'white',
  },

  BoontarTVButtonDisabled: {
    width: '100%',
    height: 40,
    backgroundColor: '#404040',
    borderWidth: 0,
    borderRadius: 5,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  BoontarTVInputLabel: {
    paddingTop: 15,
    textAlign: 'left',
    color: 'white',
  },

  BoontarTVSuccessStatus: {
    paddingTop: 15,
    color: '#2d9b2d',
  },

  BoontarTVFailedStatus: {
    paddingTop: 15,
    color: '#fd3d48',
  },

  BoontarTVInputsBox: {

  },

  BoontarTVButtonBox: {

  },
});

export default BoontarTVInputs;