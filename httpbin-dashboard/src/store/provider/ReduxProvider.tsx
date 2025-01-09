'use client';
import { store } from '../index';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';


const ReduxProvider = (props: {children: ReactNode}) => {
    const {children} = props;
 
    return (
      <Provider store={store}>
        {children}
      </Provider>
    )
}

export default ReduxProvider