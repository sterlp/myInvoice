/* global expect */

describe('Test JSUI validation', function () {
    var $compile,
        $rootScope,
        $jsuiState,
        defaultError;

    // Load the myApp module, which contains the directive
    beforeEach(module('JsUI'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function (_$compile_, _$rootScope_, _$jsuiState_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $jsuiState = _$jsuiState_;
        
        defaultError = {
           "foo.name" : {
               "message" : "validation message",
               "entity": "foo",
               "invalidValue": "foo",
               "path": "foo.name"
           }
        };
    }));
	
    it('verify _setState and clear', function () {
        $jsuiState._setState(400, null, defaultError);
        expect($jsuiState.hasValidationErrors()).toBe(true);
        expect($jsuiState.getState('foo.name').message).toBe('validation message');

        $jsuiState.clearErrors();
        expect($jsuiState.hasValidationErrors()).toBe(false);
        expect($jsuiState.getState('foo.name')).toBe(null);
    });
    
    it('use _setState null to clear validation message', function () {
        $jsuiState._setState(400, null, defaultError);
        expect($jsuiState.hasValidationErrors()).toBe(true);
        
        $jsuiState._setState(200, "ok", null);
        expect($jsuiState.hasValidationErrors()).toBe(false);
        expect($jsuiState.getState('foo.name')).toBe(null);
    });
			

    it('verify validation by name using class', function () {
        // Compile a piece of HTML containing the directive
        var element = $compile('<div><input ng-model="name" jsui-validate="foo.name"></div>')($rootScope);
        $rootScope.$digest();
        expect(element.html()).not.toContain("form-control-danger");
        
        $jsuiState._setState(400, null, defaultError);
        $rootScope.$digest();
        // Check that the compiled element contains the templated content
        expect(element.html()).toContain("form-control-danger");
        
        $jsuiState._setState(200, "OK", null);
        $rootScope.$digest();
        expect($jsuiState.hasValidationErrors()).toBe(false);
        expect($jsuiState.getState('foo.name')).toBe(null);
        expect(element.html()).not.toContain("form-control-danger");
    });
});