const assert = require('assert');
const async = require('async');

const withV4 = require('../support/withV4');
const BucketUtility = require('../../lib/utility/bucket-util');

const { removeAllVersions, versioningEnabled } =
    require('../../lib/utility/versioning-util');
const sourceBucket = 'source-bucket';
const rulePrefix = 'test-prefix';

describe("Head object 'ReplicationStatus' value", () => {
    withV4(sigCfg => {
        const bucketUtil = new BucketUtility('default', sigCfg);
        const s3 = bucketUtil.s3;

        function checkHeadObj(key, status, cb) {
            const params = { Bucket: sourceBucket, Key: key };
            return async.series([
                next => s3.putObject(params, next),
                next => s3.headObject(params, next),
            ], (err, res) => {
                if (err) {
                    return cb(err);
                }
                assert.strictEqual(res[1].ReplicationStatus, status);
                return cb();
            });
        }

        beforeEach(done => async.series([
            next => s3.createBucket({ Bucket: sourceBucket }, next),
            next => s3.putBucketVersioning({
                Bucket: sourceBucket,
                VersioningConfiguration: versioningEnabled,
            }, next),
        ], done));

        afterEach(done => async.series([
            next => removeAllVersions({ Bucket: sourceBucket }, next),
            next => s3.deleteBucket({ Bucket: sourceBucket }, next),
        ], done));

        it('should not set metadata when no bucket replication configuration',
            done => checkHeadObj(`${rulePrefix}`, undefined, done));

        describe('Putting replication configuration and put object', () => {
            beforeEach(done => s3.putBucketReplication({
                Bucket: sourceBucket,
                ReplicationConfiguration: {
                    Role: 'arn:aws:iam::account-id:role/resource',
                    Rules: [
                        {
                            Destination: { Bucket: 'arn:aws:s3:::dest-bucket' },
                            Prefix: rulePrefix,
                            Status: 'Enabled',
                        },
                    ],
                },
            }, done));

            it("should set metadata to 'PENDING' when key prefix applies",
                done => checkHeadObj(`${rulePrefix}`, 'PENDING', done));

            it('should not set metadata when key prefix does not apply',
                done => checkHeadObj('foobar', undefined, done));
        });
    });
});
