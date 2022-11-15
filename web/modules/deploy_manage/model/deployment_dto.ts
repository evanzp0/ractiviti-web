export default interface DeploymentDto {
    id: string | null,
    name: string | null,
    key: string | null,
    organization: string | null,
    deployer: string | null,
    deploy_time_start: number | null,
    deploy_time_end: number | null,
}