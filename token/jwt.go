package token

import (
	"time"

	"github.com/dgrijalva/jwt-go"
)

var privateKey = []byte("ThisISMyPivateTestSigningKey12312312")
var expTime time.Duration = 60 * time.Second

// UserClaims to be included in the JWT.
type UserClaims struct {
	ID        string `json:"id"`
	Roles     string `json:"roles"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
}

// CustomClaims combines UserClaims and StandardJWT claims.
type CustomClaims struct {
	Profile UserClaims `json:"profile"`
	jwt.StandardClaims
}

// SetData for CustomClaims and Standard JWT claims
func (cc *CustomClaims) SetData(d UserClaims) {
	//custom user profile claims
	cc.Profile = d
	// default jwt claims
	cc.Audience = d.Roles
	cc.Id = d.ID
	cc.IssuedAt = time.Now().Unix()
	//calculate expiration time
	cc.ExpiresAt = time.Now().Add(expTime).Unix()
	cc.Issuer = "dv4all-oauth2-go-service"
	cc.Subject = d.FirstName + " " + d.LastName
}

// Sign will create new token for valid user
// This method is used AFTER user is authenticated
// The data will be included in the token.
// DO NOT SEND secrity related information (like password) in the data
func Sign(claims CustomClaims) (string, error) {
	// log.Println("clams...", claims)

	newToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err := newToken.SignedString(privateKey)
	if err != nil {
		return "", err
	}
	return token, nil
}

func myKey(token *jwt.Token) (interface{}, error) {
	return privateKey, nil
}

// Verify will check if token is valid and return true/false and error message
func Verify(tokenStr string) (bool, string) {
	token, err := jwt.Parse(tokenStr, myKey)
	if err != nil {
		return false, "Invalid token"
	}
	if token.Valid {
		return true, "Valid token"
	}
	// check for know errors
	ve, ok := err.(*jwt.ValidationError)
	if ok == true {
		if ve.Errors&(jwt.ValidationErrorExpired|jwt.ValidationErrorNotValidYet) != 0 {
			return false, "Token expired"
		}
		return false, "Invalid token"
	} else {
		return false, "Invalid token"
	}
}
