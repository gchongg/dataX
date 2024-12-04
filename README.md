# Data Marketplace Blockchain
--------

**Project website:** https://suaye07.github.io/DSC180_proj_web/

<a target="_blank" href="https://cookiecutter-data-science.drivendata.org/">
    <img src="https://img.shields.io/badge/CCDS-Project%20template-328F97?logo=cookiecutter" />
</a>

This repo contains the back-end code for a decentralized application (dapp), specifically a data marketplace, on the Ethereum Blockchain. To access, go to https://suaye07.github.io/DSC180_proj_web/. Users can buy and sell data securely and in accordance with privacy laws; there are also on-chain data analytics capabilities. To begin, launch the website attached to this repository. Users, after registering for an account, can upload data to an offshore, decentralized storage location (IPFS) via `Ddm.sol` and post it to the market--along with an overview of the data–general tags like industry, description of what data is about, dataset size, and a column-by-column description; before the data is stored, the data is encrypted, has a script `malware_and_pii.py` run on it to anonymize the data and ensure no malware or SQL injections are present; then the dataset is tagged with a certification so that other users cannot upload the same data. Buyers can see this information and filter data based on their needs. Buyers then purchase desirable data with our token via smart contracts, along with paying a little extra gas to nodes to verify the transaction and upload it to the blockchain via Polygon. Buyers and sellers can also exchange services to run analytics on the data–or any data they have in-house. We will also offer our own service that offers a wide variety of ML applications, like data summarization and image description generation, and allow users to upload scripts. These analytics can be run on-chain for secure, transparent data analysis without compromising privacy. Our focus is on ensuring a safe and secure platform, where the ML applications are secondary.



