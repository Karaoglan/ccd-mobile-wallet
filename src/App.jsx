import { useState } from "react";

import "./App.css";
import {
  getPastDate,
  MIN_DATE,
  Web3StatementBuilder,
} from "@concordium/web-sdk";
import { detectConcordiumProvider } from "@concordium/browser-wallet-api-helpers";

function App() {
  const [verified, setVerified] = useState(false);

  async function ageCheck() {
    console.log('checking!!')
    const provider = await detectConcordiumProvider();
    console.log('couldnt finish detectConnector (maybe only for browser wallets?')
    try {
      const account = await provider.connect();

      if (!account) {
        alert("Please connect concordium");
      }

      // TODO Replace add range with addMinimumAge(13) when SDK is fixed.
      const statementBuilder =
        new Web3StatementBuilder().addForIdentityCredentials(
          [0, 1, 2, 3, 4, 5],
          (b) => b.addRange("dob", MIN_DATE, getPastDate(13, 1))
        );
      const statement = statementBuilder.getStatements();
      // In a production scenario the challenge should not be hardcoded, in order to avoid accepting proofs created for other contexts.
      const challenge =
        "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB";

      // Requesting ID proof to check if user is 18 years old
      provider
        .requestVerifiablePresentation(challenge, statement)
        .then(() => {
          // TODO: Verifiy the proof
          // User is 18 year old, show something
          setVerified(true);
          alert("verified");
          // isverified(flag)
        })
        .catch(() => {
          alert(
            "Age verification was not completed. Please complete the verification"
          );
        });
    } catch (error) {
      console.error(error); // from creation or business logic
      alert("Please connect ccd wallet and connect account");
    }
  }

  return (
    <>
      <a onClick={ageCheck} className="btn btn-outline-primary">
        <i className="flaticon-blockchain"></i>{" "}
        {"Verify with Concordium wallet"}
      </a>
      <br />
      VERIFIED or NOT {verified ? <p>TRUE</p> : <p>FALSE</p>}
    </>
  );
}

export default App;
