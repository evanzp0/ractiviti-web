import http from '../../../common/service/http-common';
import DeploymentDto from '../model/deployment_dto';
import {PageDto} from '../../../common/model/pagination';

class DeploymentService {
    page_query(pg_dto: PageDto<DeploymentDto>) {
        return http.post<PageDto<DeploymentDto>>("/deployment/page_query", pg_dto);
    }
}

export default new DeploymentService();