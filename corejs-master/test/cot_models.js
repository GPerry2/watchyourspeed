//a brutally rudimentary test of teh CotModel class, until a proper testing framework is in place
function testCotModel() {
    let o = new CotModel({
        id: 'one',
        title: 'some title',
        nested: {
            num: 2000,
            str: 'some string',
            obj: {
                deep: 'value'
            }
        },
        obj: new CotModel()
    });
    if (o.get('propname') !== undefined || o.get('prop.name') !== undefined || o.get('prop.name.deep') !== undefined) {
        throw new Error('Test: getting a non-existent prop name should return undefined');
    }
    if (o.get('id') !== 'one' || o.get('title') != 'some title') {
        throw new Error('Test: getting a valid prop name should return a value');
    }
    if (typeof o.get('nested') !== 'object') {
        throw new Error('Test: getting an object prop name should return the object');
    }
    if (o.get('nested.num') !== 2000 || o.get('nested.str') !== 'some string' || o.get('nested.obj.deep') !== 'value') {
        throw new Error('Test: getting a nested value should work');
    }
    if (o.get('title.invalid') !== undefined || o.get('title.invalid.path') !== undefined) {
        throw new Error('Test: getting an invalid path should return undefined');
    }
    if (o.get('obj.badpath') !== undefined) {
        throw new Error('Test: getting an invalid path in an object should return undefined');
    }
    if (typeof o.get('obj') !== 'object' || typeof o.get('obj')['get'] !== 'function') {
        throw new Error('Test: getting an object should work');
    }
    o.set('title', 'a');
    if (o.get('title') != 'a') {
        throw new Error('updating a property should work');
    }
    o.set('new', 'a');
    if (o.get('new') != 'a') {
        throw new Error('adding a property should work');
    }
    o.set('new.path', 'a');
    if (typeof o.get('new') != 'object' || o.get('new.path') != 'a') {
        throw new Error('setting a path shoudl work');
    }
    o.set('other.path', 'a');
    if (typeof o.get('other') != 'object' || o.get('other.path') != 'a') {
        throw new Error('setting a path shoudl work');
    }
    o.set('deep.nested.path', 'a');
    if (typeof o.get('deep') != 'object' || o.get('deep.nested.path') != 'a') {
        throw new Error('setting a path shoudl work');
    }
    o.set({
        'a':'a',
        'b.c':'b.c',
        'deep.nested.path': 'new'
    });
    if (o.get('a') != 'a' || typeof o.get('b') != 'object' || o.get('b.c') != 'b.c' || o.get('deep.nested.path') != 'new') {
        throw new Error('using an attribute object should work');
    }
    let changeCount = 0;
    o.on('change', function(){
        changeCount++;
    });
    o.set('one', 'two');
    if (changeCount != 1) {
        throw new Error('Change event should work');
    }
    o.set('fred.flintsone', 'wilma');
    if (changeCount != 2) {
        throw new Error('Change event should work');
    }
    return 'success'
}