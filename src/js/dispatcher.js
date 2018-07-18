const Dispatcher = function() {
    let _id = 0;
    let _callbacks = {};
    return {
        register: function (callback) {
            _callbacks[_id] = callback;
            return _id++;
        },
        unregister: function (id) {
            delete _callbacks[id];
        },
        dispatch: function (payload) {
            for (let id in _callbacks) {
                _callbacks[id](payload);
            }
        }
    }
};

export { Dispatcher };