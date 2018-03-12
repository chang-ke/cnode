import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import Reducer from "./reducer";
import { mySaga } from "./sagas/rootSaga";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(Reducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(mySaga);

export default store;
