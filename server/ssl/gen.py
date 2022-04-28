from OpenSSL import crypto, SSL
from socket import gethostname
from time import gmtime, mktime

CERT_FILE = "cert.pem"
KEY_FILE = "key.pem"

def create_self_signed_cert():

    # create a key pair
    k = crypto.PKey()
    k.generate_key(crypto.TYPE_RSA, 1024)

    # create a self-signed cert
    cert = crypto.X509()
    cert.get_subject().C = "UK"
    cert.get_subject().ST = "Yeet Street"
    cert.get_subject().L = "Amogus"
    cert.get_subject().O = "No company"
    cert.get_subject().OU = "Just me"
    cert.get_subject().CN = gethostname()
    cert.set_serial_number(1000)
    cert.gmtime_adj_notBefore(0)
    cert.gmtime_adj_notAfter(10*365*24*60*60)
    cert.set_issuer(cert.get_subject())
    cert.set_pubkey(k)
    cert.sign(k, 'sha1')

    open(CERT_FILE, "wb").write(
        crypto.dump_certificate(crypto.FILETYPE_PEM, cert))
    open(KEY_FILE, "wb").write(
        crypto.dump_privatekey(crypto.FILETYPE_PEM, k))

create_self_signed_cert()