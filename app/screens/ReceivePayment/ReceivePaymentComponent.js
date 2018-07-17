import React from 'react';
import { Text, View, StyleSheet, Clipboard, Dimensions } from 'react-native';
import { Container, Root } from 'native-base';
import QRCode from 'react-native-qrcode';
import BosonColors from '../../native-base-theme/variables/bosonColor';
import LunesPaymentButton from '../../native-base-theme/components/LunesPaymentButton';
import LunesTabCoins from '../../native-base-theme/components/LunesTabCoins';
import I18N from '../../i18n/i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleReceivePayment: {
    padding: 10,
    color: BosonColors.$bosonWhite,
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
  },
  wrapperQRCode: {
    backgroundColor: BosonColors.$bosonWhite,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: BosonColors.$bosonWhite,
    borderWidth: 0,
    margin: 10,
    borderRadius: 5,
    padding: 5,
    color: BosonColors.$bosonWhite,
    fontSize: 12,
  },
  textCopy: {
    color: BosonColors.$bosonLightGreen,
    fontSize: 14,
    padding: 10,
  },
  textToast: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default class ReceivePayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
    };
  }

  setClipboardContent = address => {
    Clipboard.setString(address);
  };

  getAddressWallet() {
    const { balance, currentCoinSelected } = this.props;
    try {
      // eslint-disable-next-line
      return balance[currentCoinSelected].address;
    } catch (error) {
      return '';
    }
  }

  getInitialCoinName() {
    const { currentCoinSelected } = this.props;
    try {
      // eslint-disable-next-line
      if (currentCoinSelected === 'LNS') {
        return 'Lunes';
      } else if (currentCoinSelected === 'BTC') {
        return 'Bitcoin';
      }
    } catch (error) {
      return '';
    }
  }

  render() {
    const address = this.getAddressWallet();
    return (
      <Container>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row' }}>
            <LunesTabCoins
              ticker={this.props.ticker}
              doAction={tabCoin => {
                const { user, balance, doAction } = this.props;
                doAction(user, balance, tabCoin.name);
              }}
            />
          </View>
          <Text style={styles.titleReceivePayment}> </Text>
          <View style={styles.wrapperQRCode}>
            <QRCode
              value={address}
              size={200}
              bgColor="black"
              fgColor="white"
            />
          </View>

          <Text style={styles.input}>
            {I18N.t('ADDRESS')} {this.getInitialCoinName()}
          </Text>

          <Text style={styles.input} selectable={true}>
            {address}
          </Text>

          {this.state.showToast === false ? (
            <Text
              style={styles.textCopy}
              selectable={true}
              onPress={() => {
                this.setState({ showToast: true });
                this.setClipboardContent(address);
                setTimeout(() => {
                  this.setState({ showToast: false });
                }, 5000);
              }}>
              {I18N.t('CLICK_HERE_TO_COPY')}
            </Text>
          ) : null}

          {this.state.showToast ? (
            <Text style={styles.textToast}>{I18N.t('ADDRESS_COPIED')}</Text>
          ) : null}

          <LunesPaymentButton />
        </View>
      </Container>
    );
  }
}
