cd /etc/letsencrypt/live/dietfarm.co.kr

sudo openssl pkcs12 -export -in cert.pem -inkey privkey.pem -out /home/ubuntu/DietFarmWeb/cert/cert.pfx
