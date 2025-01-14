import React, { useState, Fragment } from 'react';
import {
  EuiHealth,
  EuiCallOut,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiCodeBlock,
  EuiTitle,
  EuiSwitch,
  EuiBasicTable,
  EuiSearchBar,
} from '@elastic/eui';
var lucene_parser = require('lucene-query-parser');

const initialQuery = EuiSearchBar.Query.MATCH_ALL;
export const SearchBar = () => {
  const [query, setQuery] = useState(initialQuery);
  const [error, setError] = useState(null);
  const onChange = ({ query, error }) => {
    if (error) {
      setError(error);
    } else {
      setError(null);
      setQuery(query);
    }
  };
  const renderSearch = () => {
    return (
      <EuiSearchBar
        defaultQuery={initialQuery}
        box={{
          placeholder: 'Type to search...',
        }}
        onChange={onChange}
      />
    );
  };
  let esQueryDsl;
  let esQueryString;
  // let parsedQuery;
  let luceneQuery;
  let esQuerySimple;
  let luceneQueryDsl;
  let currentBehavior;
  try {
     currentBehavior = {
        bool: {
          must: [],
          filter: [
            {
              multi_match: {
              type: "best_fields",
              query: query.text,
              lenient: true
            }
          }
        ],
      } 
    }
  } catch (e) {
    currentBehavior = e.toString();
    console.log(e);
  }
  try {
    esQueryDsl = EuiSearchBar.Query.toESQuery(query);
  } catch (e) {
    esQueryDsl = e.toString();
    console.log(e);
  }
  try {
    esQueryString = EuiSearchBar.Query.toESQueryString(query);
    esQuerySimple = {
      bool: {
        must: [],
        filter: [
          {
            multi_match: {
              type: "best_fields",
              query: esQueryString,
              lenient: true
            }
          }
        ],
      }
    }
  } catch (e) {
    esQueryString = e.toString();
    console.log(e);
  }
  // try {
  //   parsedQuery = {query: ElasticQueryParser.parse(query)};
  // } catch (e) {
  //   parsedQuery = e.toString();
  // }
  try {
    luceneQuery = lucene_parser.parse(query.text);
    luceneQueryDsl = {
      bool: {
        must: [{
          query_string: {
            query: query.text
          }
        }],
      }
    }
  } catch (e) {
    luceneQuery = e.toString();
    luceneQueryDsl = e.toString();
    console.log(e);
  }
  console.log(currentBehavior);
  console.log(esQueryDsl);
  console.log(luceneQueryDsl);

  const content = (
    <EuiFlexGroup>
      <EuiFlexItem grow={4}>
        <EuiTitle size="s">
          <h3>Current behavior:</h3>
        </EuiTitle>
        <EuiSpacer size="s" />
        <EuiCodeBlock language="js">
        {currentBehavior ? JSON.stringify(currentBehavior, null, 2) : ''}
        </EuiCodeBlock>
        <EuiSpacer size="l" />
        <EuiTitle size="s">
          <h3>Elasticsearch Query DSL Using 'toESQuery'</h3>
        </EuiTitle>
        <EuiSpacer size="s" />
        <EuiCodeBlock language="js">
          {esQueryDsl ? JSON.stringify(esQueryDsl, null, 2) : ''}
        </EuiCodeBlock>
        <EuiSpacer size="l" />
        <EuiTitle size="s">
          <h3>Lucene Query via DSL</h3>
        </EuiTitle>
        <EuiSpacer size="s" />
        <EuiCodeBlock language="js">
          {luceneQueryDsl ? JSON.stringify(luceneQueryDsl, null, 2) : ''}
        </EuiCodeBlock>
        <EuiSpacer size="l" />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
  return (
    <Fragment>
      <EuiSpacer size="l" />
      {renderSearch()}
      <EuiSpacer size="s" />
      <EuiSpacer size="l" />
      {content}
    </Fragment>
  );
};

export default SearchBar;