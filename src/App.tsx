import { Table, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Currency } from '../src/types/currencies';

function App() {

  const [currencies, setCurrencies] = useState<Currency[] | null>(null);

  useEffect(() => {
      fetch("https://www.cbr-xml-daily.ru/daily_json.js")
          .then((res) => res.json())
          .then((json) => {
            const currencyData: Currency[] = Object.values(json.Valute);
            setCurrencies(currencyData);
          })
  },[]);

  const rounded = function(number: number) {
    return Math.round(number * 1e2) / 1e2;
  }

  const today = new Date().toLocaleDateString('ru', { year: 'numeric', month: '2-digit', day: '2-digit' });

  return (
    <div className="App">
      <div className="container">
        <h1 className="text-center mt-3 mb-5">{`Курсы валют ЦБ РФ на ${today}`}</h1>

        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Валюта</th>
              <th>Курс</th>
              <th>Разница с предыдущим днём в %</th>
            </tr>
          </thead>
          <tbody>
            {
              currencies?.map(({CharCode, Value, Name, Previous}) => {
                const currencyDiff = 100.0 * (Previous - Value) / Value;

                return(
                  <tr key={Name}>
                    <td>
                      {
                        <OverlayTrigger
                          key={Name}
                          placement="bottom"
                          overlay={
                            <Tooltip id={`tooltip-${CharCode}`}>
                              <strong>{Name}</strong>
                            </Tooltip>
                          }
                        >
                          <Button variant="transparent">{CharCode}</Button>
                        </OverlayTrigger>
                      }
                    </td>
                    <td>{Value}</td>
                    <td className={currencyDiff > 0 ? 'text-success' : 'text-danger'}>
                      {
                        currencyDiff > 0 ? `↑ +${rounded(currencyDiff)}%` : `↓ ${Math.abs(rounded(currencyDiff))}%`
                      }
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default App;
