import React from 'react';

import { useWeb3Context, useAccountBalance } from 'web3-react/hooks'

import ReactTable from "react-table";
import 'react-table/react-table.css'
import './AccountsTable.css';

function InitiateLiquidation(targetAccount_, web3) {
  const myAccount = web3.address; // account of liquidator
  const targetAccount = targetAccount_; // account in default
  const assetBorrow = '...'; // asset target borrowed (in default)
  const assetCollateral = '...'; // asset target supplied as collateral
  const requestAmountClose = -1;

  // var context = useWeb3Context();
  window.alert("Liquidation coming soon™");
  // const moneyMarket = MoneyMarket.at('');
  // moneyMarket.methods.liquidiate(targetAccount, assetBorrow, assetCollateral, requestAmountClose).send({ from: myAccount }).on('transactionHash', (trxHash) => {
  //   console.log(`View your liquidation trx at: https://etherscan.io/tx/${trxHash}`);
  // });
}

  function AccountsTable (props) {  
    const web3 = useWeb3Context()
    // const balance = useAccountBalance()
    
    const data = [];

      props.accounts.forEach((account) => {
        var supplyAmount = (account.totalEthSupply / 1e18).toFixed(3);
        var borrowAmount = (account.totalEthBorrow / 1e18).toFixed(3);

        var ratio = +((supplyAmount / borrowAmount).toFixed(3));

        var minCollateralRatio = 1.5;
        var riskyCollateralRatio = 2;

        var state = "";

        if (ratio < minCollateralRatio) {
          state = "unsafe";
        } else if (ratio <= riskyCollateralRatio) {
          state = "risky";
        } else {
          state = "safe";
        }

        var ratioDisplay = (ratio * 100).toFixed(1) + "%";

        var liquidateStatus = (ratio >= minCollateralRatio) ? '0' : '1';

        var account = {
          address : account.address,
          supply : supplyAmount,
          borrow : borrowAmount,
          ratio : ratioDisplay,
          state : state,
          block : account.blockUpdated,
          liquidate : liquidateStatus
        }
        data.push(account);
      });

      const columns = [
        {
          Header: "Address",
          accessor : 'address',
          maxWidth: 750,
          Cell: row => (
              <a href={'https://etherscan.io/address/' + row.value} target='_blank'>{row.value}</a>            
          )

        },
        {
          Header: "Supply",
          accessor : 'supply',
          maxWidth: 200,
          className: "right"
        },
        {
          Header: "Borrow",
          accessor : 'borrow',
          maxWidth: 200,
          className: "right"
        },
        {
          Header: "Ratio",
          accessor : 'ratio',
          maxWidth: 200,
          className: "right"
        },
        {
          Header: "State",
          accessor : 'state',
          maxWidth: 200,
          Cell: row => (
            <span>
              <span style={{
                color: row.value === 'safe' ? '#57d500' : row.value === 'risky' ? '#ffbf00' : '#ff2e00',
                
                transition: 'all .3s ease'
              }}>
                &#x25cf;
              </span> {
                row.value === 'safe' ? 'Safe' : row.value === 'risky' ? 'Risky' : 'Unsafe'
              }
            </span>
          )
        },
        {
          Header: "",
          accessor : 'liquidate',
          maxWidth: 200,
          Cell: row => (
            <button className="liquidateButton" disabled={row.value === '0' ? true : false} 
            onClick={
              () => InitiateLiquidation(row.row.address, web3)
            }>Liquidate</button>
          )
        }
      ];

      var showPageSizeOptions = false;
      var defaultPageSize = 20;

      var minRows = defaultPageSize;

    return (
        <ReactTable 
          data={data}
          columns={columns}
          defaultPageSize={defaultPageSize}
          showPageSizeOptions={showPageSizeOptions}
          className="-striped"           
        />
      
    )
  }

  export default AccountsTable; 