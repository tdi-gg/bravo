// -------------------------------------------------------------------
// ログイン画面
// -------------------------------------------------------------------
'use strict';

//import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'aws-cognito/amazon-cognito-identity.min.js';

const poolData = {
   	UserPoolId : 'ap-northeast-1_uNHvkMFgS',
    ClientId : '25qn02mfvd1g9r98raaapabems'
};
const userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData);


var login = function() {

	var publicScope = {

		/**
		 * 初期表示処理。
		 */
		init : function() {
			
			// Amazon Cognito 認証情報プロバイダーを初期化します
			AWS.config.region = 'ap-northeast-1'; // リージョン
			AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			    IdentityPoolId: 'ap-northeast-1:7e79bd29-dacb-4c23-9f24-b88be1bb3333',
			});

			// 「Sign In」ボタン押下時
			$("#signin").click(function(event) {
				login.signIn();
			});

		},

		/**
		 * サインイン処理。
		 */
		signIn : function() {
			
		    var username = $('#userName').val();
		    var password = $('#password').val();
		    if (!username | !password) { return false; }
		    
		    var authenticationData = {
		        Username: username,
		        Password: password
		    };
		    		    
		    var authenticationDetails = new AWS.Cognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
		    
		    var userData = {
		        Username: username,
		        Pool: userPool
		    };
		    
		    var message_text;
		    var cognitoUser = new AWS.Cognito.CognitoIdentityServiceProvider.CognitoUser(userData);
		    cognitoUser.authenticateUser(authenticationDetails, {
		        onSuccess: function(result) {
		            console.log('access token + ' + result.getAccessToken().getJwtToken());
		 
		            AWS.config.region = 'ap-northeast-1';
		            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		                IdentityPoolId: 'ap-northeast-1:7e79bd29-dacb-4c23-9f24-b88be1bb3333',
		                Logins: {
		                    'cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_uNHvkMFgS': result.getIdToken().getJwtToken()
		                }
		            });
		             
		            AWS.config.credentials.refresh(function(err) {
		                if (err) {
		                    console.log(err);
		                } else {
		                    console.log("success");
		                    console.log("id:" + AWS.config.credentials.identityId);                    
		                }
		 
//		                $(location).attr('href', 'mypage.html');
		                console.log("test");
		            });
		            //console.log("id:" + AWS.config.credentials.identityId);
		             
		            //$(location).attr('href', 'mypage.html');
		        },
		 
		        onFailure: function(err) {
		            alert(err);
		        }
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