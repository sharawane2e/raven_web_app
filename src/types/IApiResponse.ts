interface IApiResponse {
  /**
   * tells whether the request is success or failure
   */
  success: boolean;

  /**
   * contains the reponse message sent by the server
   */
  message: string;

  /**
   * contains the response data sent by the server
   */
  data: any;
}

export default IApiResponse;
