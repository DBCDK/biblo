/**
 * Creating ElasticTranscoder jobs at AWS
 *
 * @param {Object} videoData
 * @param {string} postId
 * @param {string} commentId
 * @param {string} reviewId
 * @param {Object} logger
 */
export function createElasticTranscoderJob(
  ElasticTranscoder,
  videoData,
  postId,
  commentId,
  reviewId,
  logger,
  AMAZON_CONFIG
) {
  if (postId && typeof postId !== 'string') {
    postId = postId.toString();
  }

  if (commentId && typeof commentId !== 'string') {
    commentId = commentId.toString();
  }

  if (reviewId && typeof reviewId !== 'string') {
    reviewId = reviewId.toString();
  }

  // AWS Docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticTranscoder.html#createJob-property
  const params = {
    Input: {
      Key: videoData.videofile
    },
    PipelineId: AMAZON_CONFIG.transcoding.pipelineId,
    Output: {
      Key: `${videoData.pureFileName}.mp4`,
      PresetId: AMAZON_CONFIG.transcoding.presetId,
      ThumbnailPattern: `${videoData.pureFileName}_thumb_{count}`
    },
    UserMetadata: {
      destinationContainer: AMAZON_CONFIG.buckets.videoOutputBucket,
      mimetype: 'video/mp4' // mimetype af output
    }
  };

  if (postId) {
    params.UserMetadata.postId = postId;
  }

  if (commentId) {
    params.UserMetadata.commentId = commentId;
  }

  if (reviewId) {
    params.UserMetadata.reviewId = reviewId;
  }

  ElasticTranscoder.createJob(params, err => {
    if (err) {
      logger.error('ElasticTranscoder job creation failed', {error: err, params: params});
    } else {
      logger.info('ElasticTranscoder job was successfully created', {params: params});
    }
  });
}

export default createElasticTranscoderJob;
