// -------------------------------------------------------------------
// ログイン画面
// -------------------------------------------------------------------
var login = function() {

	var publicScope = {

		/**
		 * 初期表示処理。
		 */
		init : function() {

			// 「Sign In」ボタン押下時
			$("#signin").click(function(event) {
				login.signIn();
			});

		},

		/**
		 * サインイン処理。
		 */
		signIn : function() {
			
			// 認証データ
			var authenticationData = {
		        Username : $("#userName").val(),
		        Password : $("#password").val()
		    };
		    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
		    
		    // ユーザープールの指定
		    var poolData = { 
		    	UserPoolId : 'ap-northeast-1_e4iqhHG5c',
		        ClientId : 'nf2jk74rdq92vvkf4n3brrdl9'
		    };
		    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
		    
		    var userData = {
		        Username : $("#userName").val(),
		        Pool : userPool
		    };
		    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
		    cognitoUser.authenticateUser(authenticationDetails, {
		        onSuccess: function (result) {
		            var accessToken = result.getAccessToken().getJwtToken();
		            
		            /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
		            var idToken = result.idToken.jwtToken;

		            console.log("accessToken : " + accessToken);
		            console.log("idToken : " + idToken);
		        },

		        onFailure: function(err) {
		            alert(err);
		        },

		    });
		}
	};
	return publicScope;
}();

/**
 * 画面読み込み時の処理
 */
$(document).ready(function() {
	login.init();
});