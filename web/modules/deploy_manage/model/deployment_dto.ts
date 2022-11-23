import {Dayjs} from "dayjs";

export default interface DeploymentDto {
    id: string | null,
    name: string | null,
    key: string | null,
    company_name: string | null,
    deployer_name: string | null,
    deploy_time_from: Dayjs | number | null,
    deploy_time_to: Dayjs | number | null,
}