export default interface Procdef {
    id: string,
    rev: number,
    name:  String,
    key: String, 
    version: number,
    deployment_id: string,
    suspension_state: number,
    company_id: string,
    company_name: string,
    deployer_id: string,
    deployer_name: string,
    deploy_time: number
}